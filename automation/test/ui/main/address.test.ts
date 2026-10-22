import { test } from '@playwright/test';
import AddressDto from '../../../dto/address/address.dto.js';
import AddressResponseDto from '../../../dto/address/address.response.dto.js';
import { AddressApiSteps } from '../../../steps/api/addressApiSteps.js';
import { AuthApiSteps } from '../../../steps/api/authApiSteps.js';
import { AddressSteps } from '../../../steps/ui/main/addressSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';

test.describe('Addresses', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
  let addressSteps: AddressSteps;
  let createdAddress: AddressDto | undefined;

  test.beforeEach(async ({ page, request }) => {
    const authApiSteps = new AuthApiSteps(request);
    const loginSteps = new LoginSteps(page);
    addressSteps = new AddressSteps(page);

    const token = await authApiSteps.getAdminAccessToken();
    await loginSteps.openHomeWithAccessToken(token);
  });

  test.afterEach(async ({ request }) => {
    if (!createdAddress) {
      return;
    }

    const authApiSteps = new AuthApiSteps(request);
    const addressApiSteps = new AddressApiSteps(request);
    const token = await authApiSteps.getAdminAccessToken();
    const response = await addressApiSteps.getAddresses(token);
    const addresses = (await response.json()) as AddressResponseDto[];
    const created = addresses.find(
      (address) => address.streetAddress === createdAddress?.streetAddress,
    );

    if (created) {
      await addressApiSteps.deleteAddress(token, created.id);
    }

    createdAddress = undefined;
  });

  test('Check that a new address can be added', async () => {
    const address = new AddressDto();

    const uniqueId = Date.now().toString().slice(-8);

    address.streetAddress = `Street ${uniqueId}`;
    address.city = 'Kharkiv';
    address.state = 'UA';
    address.zipCode = '61000';

    await addressSteps.addAddress(address);

    createdAddress = address;

    await addressSteps.expectAddressInTable(address);
  });

  test('Check that a new address can be deleted', async () => {
    const address = new AddressDto();

    const uniqueId = Date.now().toString().slice(-8);

    address.streetAddress = `Street ${uniqueId}`;
    address.city = 'Kharkiv';
    address.state = 'UA';
    address.zipCode = '61000';

    await addressSteps.addAddress(address);
    await addressSteps.expectAddressInTable(address);

    await addressSteps.deleteAddress(address);
    await addressSteps.expectAddressNotInTable(address);
  });

  test('Check that an address with an invalid zip code is rejected', async () => {
    const address = new AddressDto();

    address.streetAddress = 'Test Street';
    address.city = 'Kharkiv';
    address.state = 'KH';
    // A valid Zip Code is 5 digits, 9 digits, or 5 digits, a hyphen, and 4 digits.
    address.zipCode = '1234A';

    await addressSteps.submitAddAddressForm(address);
    await addressSteps.expectOnlyZipCodeInvalid();
  });
});
