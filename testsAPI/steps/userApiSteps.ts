import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import UserRequestDto from '../DTO/user.request.dto.js';
import UserResponseDto from '../DTO/user.response.dto.js';

export class UserApiSteps {
  constructor(private request: APIRequestContext) {}

  async getUsers(token?: string): Promise<APIResponse> {
    return this.request.get(
      '/api/User',
      token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    );
  }

  async createUser(token: string, user: UserRequestDto): Promise<APIResponse> {
    return this.request.post('/api/User', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        gender: user.gender,
      },
    });
  }

  async getUserById(token: string, id: string): Promise<APIResponse> {
    return this.request.get(`/api/User/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateUser(token: string, id: string, user: UserRequestDto): Promise<APIResponse> {
    return this.request.put(`/api/User/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        gender: user.gender,
      },
    });
  }

  async deleteUser(token: string, id: string): Promise<APIResponse> {
    return this.request.delete(`/api/User/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  buildUser(namePrefix: string): UserRequestDto {
    const user = new UserRequestDto();
    const uniqueId = Date.now().toString().slice(-6);

    user.name = `${namePrefix}${uniqueId}`;
    user.yearOfBirth = 1995;
    user.gender = 1;

    return user;
  }

  async createUserForTest(token: string, user: UserRequestDto): Promise<UserResponseDto> {
    const response = await this.createUser(token, user);

    expect(response.status()).toBe(200);

    return (await response.json()) as UserResponseDto;
  }
}
