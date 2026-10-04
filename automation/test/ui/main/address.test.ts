import { test } from '@playwright/test';
import AddressDto from '../../../dto/address/address.dto.js';
import { AddressSteps } from '../../../steps/ui/main/addressSteps.js';
import { HomeSteps } from '../../../steps/ui/main/homeSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';

const SITE_TITLE = 'Trainees website';

test.describe('Addresses', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
  let homeSteps: HomeSteps;
  let addressSteps: AddressSteps;
  let createdAddress: AddressDto | undefined;

  test.beforeEach(async ({ page }) => {
    const loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);
    addressSteps = new AddressSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithAdminCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test.afterEach(async ({ page }) => {
    if (!createdAddress) {
      return;
    }

    await page.goto('/');
    await addressSteps.deleteAddress(createdAddress);
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
});
