import { expect, test } from '@playwright/test';
import { AddressApiSteps } from '../../steps/api/addressApiSteps.js';
import { AuthApiSteps } from '../../steps/api/authApiSteps.js';
import AddressResponseDto from '../../dto/address/address.response.dto.js';

test.describe('Address API', { tag: '@api' }, () => {
  let authApiSteps: AuthApiSteps;
  let addressApiSteps: AddressApiSteps;

  test.beforeEach(async ({ request }) => {
    authApiSteps = new AuthApiSteps(request);
    addressApiSteps = new AddressApiSteps(request);
  });

  test('Check that the addresses list is returned', async () => {
    const token = await authApiSteps.getValidAccessToken();
    const response = await addressApiSteps.getAddresses(token);

    expect(response.status()).toBe(200);

    const addresses = (await response.json()) as AddressResponseDto[];

    expect(Array.isArray(addresses)).toBe(true);
    expect(addresses.length).toBeGreaterThanOrEqual(3);
    expect(addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          streetAddress: '178 Broadway',
          city: 'New York',
          state: 'NY',
          zipCode: '11211',
        }),
        expect.objectContaining({
          streetAddress: '201 W Austin Blvd',
          city: 'Nevada',
          state: 'MO',
          zipCode: '64772',
        }),
        expect.objectContaining({
          streetAddress: '205 E Houston St',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
        }),
      ]),
    );
  });

  test('Check that addresses cannot be requested without a token', async () => {
    const response = await addressApiSteps.getAddresses();

    expect(response.status()).toBe(401);
  });

  test('Check that an invalid address is rejected', async () => {
    const token = await authApiSteps.getValidAccessToken();
    const address = addressApiSteps.buildAddress('Bad');

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

  test.describe('Address CRUD', () => {
    let token: string;
    let adminToken: string;
    let createdId: string | undefined;

    test.beforeEach(async () => {
      createdId = undefined;
      token = await authApiSteps.getValidAccessToken();
      adminToken = await authApiSteps.getAdminAccessToken();
    });

    test.afterEach(async () => {
      if (createdId) {
        await addressApiSteps.deleteAddress(adminToken, createdId);
      }
    });

    test('Check that an address can be created', async () => {
      const address = addressApiSteps.buildAddress('Created');
      const created = await addressApiSteps.createAddressForTest(token, address);
      createdId = created.id;

      expect(created.id).toEqual(expect.any(String));
      expect(created).toMatchObject({
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      });
    });

    test('Check that a created address can be retrieved by id', async () => {
      const address = addressApiSteps.buildAddress('GetById');
      const created = await addressApiSteps.createAddressForTest(token, address);
      createdId = created.id;

      const response = await addressApiSteps.getAddressById(token, created.id);

      expect(response.status()).toBe(200);

      const fetched = (await response.json()) as AddressResponseDto;

      expect(fetched).toMatchObject({
        id: created.id,
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      });
    });

    test('Check that an address cannot be deleted without admin rights', async () => {
      const address = addressApiSteps.buildAddress('UserDelete');
      const created = await addressApiSteps.createAddressForTest(token, address);
      createdId = created.id;

      const response = await addressApiSteps.deleteAddress(token, created.id);

      expect(response.status()).toBe(403);
    });

    test('Check that an admin can delete an address', async () => {
      const address = addressApiSteps.buildAddress('AdminDelete');
      const created = await addressApiSteps.createAddressForTest(token, address);
      createdId = created.id;

      const response = await addressApiSteps.deleteAddress(adminToken, created.id);

      expect(response.status()).toBe(200);
    });

    test('Check that a deleted address cannot be retrieved', async () => {
      const address = addressApiSteps.buildAddress('404');
      const created = await addressApiSteps.createAddressForTest(token, address);
      createdId = created.id;

      await addressApiSteps.deleteAddress(adminToken, created.id);

      const response = await addressApiSteps.getAddressById(token, created.id);

      expect(response.status()).toBe(404);
    });
  });
});
