import { test } from '@playwright/test';
import AddAddressDTO from '../DTO/add.address.dto.js';
import AddUserDTO from '../DTO/add.user.dto.js';
import { HomeSteps } from '../steps/homeSteps.js';
import { LoginSteps } from '../steps/loginSteps.js';

const SITE_TITLE = 'Trainees website';

test.describe('Home page', () => {
  let homeSteps: HomeSteps;

  test.beforeEach(async ({ page }) => {
    const loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that the home page heading is displayed', async () => {
    await homeSteps.expectHeadingAndSubtitle();
  });

  test('Check that the header navigation is visible', async () => {
    await homeSteps.expectHeaderNavigation();
  });

  test('Check that the Users table is displayed', async () => {
    await homeSteps.expectUsersSection();
    await homeSteps.expectSeedUsers();
  });

  test('Check that the users total matches the table rows', async () => {
    await homeSteps.expectUsersTotalMatchesRows();
  });

  test('Check that the Addresses table is displayed', async () => {
    await homeSteps.expectAddressesSection();
    await homeSteps.expectAddressesTotalMatchesRows();
  });

  test('Check that Add User opens the create form', async () => {
    await homeSteps.openAddUserForm();
    await homeSteps.expectAddUserFormVisible();
  });

  test('Check that Add Address opens the create form', async () => {
    await homeSteps.openAddAddressForm();
    await homeSteps.expectAddAddressFormVisible();
  });

  test.describe('Create and delete', () => {
    let createdUser: AddUserDTO | undefined;
    let createdAddress: AddAddressDTO | undefined;

    test.beforeEach(async ({ page }) => {
      const loginSteps = new LoginSteps(page);
      homeSteps = new HomeSteps(page);

      await loginSteps.openLoginPage();
      await loginSteps.loginWithAdminCredentials();
      await homeSteps.expectHomePageLoaded(SITE_TITLE);
    });

    test.afterEach(async ({ page }) => {
      if (!createdUser && !createdAddress) {
        return;
      }

      await page.goto('/');

      if (createdUser) {
        await homeSteps.deleteUser(createdUser);
        createdUser = undefined;
      }

      if (createdAddress) {
        await homeSteps.deleteAddress(createdAddress);
        createdAddress = undefined;
      }
    });

    test('Check that a new user can be added', async () => {
      const user = new AddUserDTO();

      user.userName = 'Oleksandr';
      user.yearOfBirth = '1980';
      user.gender = 'Male';

      await homeSteps.addUser(user);

      createdUser = user;

      await homeSteps.expectUserInTable(user);
    });

    test('Check that a new user can be deleted', async () => {
      const user = new AddUserDTO();

      const uniqueId = Date.now().toString().slice(-8);

      user.userName = `Auto${uniqueId}`;
      user.yearOfBirth = '1995';
      user.gender = 'Male';

      await homeSteps.addUser(user);
      await homeSteps.expectUserInTable(user);

      await homeSteps.deleteUser(user);
      await homeSteps.expectUserNotInTable(user);
    });

    test('Check that a new address can be added', async () => {
      const address = new AddAddressDTO();

      const uniqueId = Date.now().toString().slice(-8);

      address.street = `Street ${uniqueId}`;
      address.city = 'Kharkiv';
      address.state = 'UA';
      address.zipCode = '61000';

      await homeSteps.addAddress(address);

      createdAddress = address;

      await homeSteps.expectAddressInTable(address);
    });

    test('Check that a new address can be deleted', async () => {
      const address = new AddAddressDTO();

      const uniqueId = Date.now().toString().slice(-8);

      address.street = `Street ${uniqueId}`;
      address.city = 'Kharkiv';
      address.state = 'UA';
      address.zipCode = '61000';

      await homeSteps.addAddress(address);
      await homeSteps.expectAddressInTable(address);

      await homeSteps.deleteAddress(address);
      await homeSteps.expectAddressNotInTable(address);
    });
  });
});
