import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import AddressDto from '../../commonDto/DTO/address.dto.js';
import AddressResponseDto from '../DTO/address.response.dto.js';

export class AddressApiSteps {
  constructor(private request: APIRequestContext) {}

  async getAddresses(token?: string): Promise<APIResponse> {
    return this.request.get(
      '/api/Address',
      token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    );
  }

  async createAddress(token: string, address: AddressDto): Promise<APIResponse> {
    return this.request.post('/api/Address', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    });
  }

  async getAddressById(token: string, id: string): Promise<APIResponse> {
    return this.request.get(`/api/Address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteAddress(token: string, id: string): Promise<APIResponse> {
    return this.request.delete(`/api/Address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  buildAddress(streetPrefix: string): AddressDto {
    const address = new AddressDto();
    const uniqueId = Date.now().toString().slice(-6);

    address.streetAddress = `${streetPrefix}${uniqueId}`;
    address.city = 'Kharkiv';
    address.state = 'UA';
    address.zipCode = '61000';

    return address;
  }

  async createAddressForTest(token: string, address: AddressDto): Promise<AddressResponseDto> {
    const response = await this.createAddress(token, address);

    expect(response.status()).toBe(200);

    return (await response.json()) as AddressResponseDto;
  }
}
