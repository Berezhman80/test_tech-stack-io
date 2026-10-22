import { test } from '@playwright/test';
import { AuthApiSteps } from '../../../steps/api/authApiSteps.js';
import { HomeSteps } from '../../../steps/ui/main/homeSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';
import { UserSteps } from '../../../steps/ui/main/userSteps.js';

test.describe('Home page', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
  let homeSteps: HomeSteps;

  test.beforeEach(async ({ page, request }) => {
    const authApiSteps = new AuthApiSteps(request);
    const loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);

    const token = await authApiSteps.getValidAccessToken();
    await loginSteps.openHomeWithAccessToken(token);
  });

  test('Check that the home page heading is displayed', async () => {
    await homeSteps.expectHeadingAndSubtitle();
  });

  test('Check that the header navigation is visible', async () => {
    await homeSteps.expectHeaderNavigation();
  });

  test('Check that the Users table is displayed', async ({ page }) => {
    const userSteps = new UserSteps(page);

    await homeSteps.expectUsersSection();
    await userSteps.expectSeedUsers();
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
});
