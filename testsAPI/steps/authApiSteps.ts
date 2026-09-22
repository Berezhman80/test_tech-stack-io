import { type APIRequestContext, type APIResponse } from '@playwright/test';
import UserDTO from '../../testsUI/DTO/user.dto.js';
import AuthResponseDto from '../DTO/auth.response.dto.js';

export class AuthApiSteps {
  constructor(private request: APIRequestContext) {}

  async login(user: UserDTO): Promise<APIResponse> {
    return this.request.post('/api/Auth/login', {
      data: {
        username: user.username,
        password: user.password,
      },
    });
  }

  async loginWithValidCredentials(): Promise<APIResponse> {
    return this.login(this.getValidUser());
  }

  async getValidAccessToken(): Promise<string> {
    const response = await this.loginWithValidCredentials();
    const body = (await response.json()) as AuthResponseDto;

    return body.accessToken;
  }

  async getAdminAccessToken(): Promise<string> {
    const response = await this.login(this.getAdminUser());
    const body = (await response.json()) as AuthResponseDto;

    return body.accessToken;
  }

  private getValidUser(): UserDTO {
    const user = new UserDTO();
    user.username = process.env.LOGIN ?? '';
    user.password = process.env.PASSWORD ?? '';

    if (!user.username || !user.password) {
      throw new Error('LOGIN and PASSWORD environment variables must be set');
    }

    return user;
  }

  private getAdminUser(): UserDTO {
    const user = new UserDTO();
    user.username = process.env.ADMIN_LOGIN ?? '';
    user.password = process.env.ADMIN_PASSWORD ?? '';

    if (!user.username || !user.password) {
      throw new Error('ADMIN_LOGIN and ADMIN_PASSWORD environment variables must be set');
    }

    return user;
  }
}
