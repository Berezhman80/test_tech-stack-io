import { type APIRequestContext, type APIResponse } from '@playwright/test';
import AddressRequestDto from '../DTO/address.request.dto.js';

export class AddressApiSteps {
  constructor(private request: APIRequestContext) {}

  async createAddress(token: string, address: AddressRequestDto): Promise<APIResponse> {
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
}
