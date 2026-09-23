import { expect, test } from '@playwright/test';
import AddressRequestDto from '../DTO/address.request.dto.js';
import { AddressApiSteps } from '../steps/addressApiSteps.js';
import { AuthApiSteps } from '../steps/authApiSteps.js';

test.describe('Address API', () => {
  let authApiSteps: AuthApiSteps;
  let addressApiSteps: AddressApiSteps;

  test.beforeEach(async ({ request }) => {
    authApiSteps = new AuthApiSteps(request);
    addressApiSteps = new AddressApiSteps(request);
  });

  test('Check that an invalid address is rejected', async () => {
    const token = await authApiSteps.getValidAccessToken();
    const address = new AddressRequestDto();

    address.streetAddress = 'ab';
    address.city = 'x';
    address.state = 'y';
    address.zipCode = '1';

    const response = await addressApiSteps.createAddress(token, address);

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body).toMatchObject({
      status: 400,
      title: 'One or more validation errors occurred.',
    });
    expect(body.errors).toMatchObject({
      StreetAddress: expect.any(Array),
      City: expect.any(Array),
      State: expect.any(Array),
      ZipCode: expect.any(Array),
    });
  });
});
