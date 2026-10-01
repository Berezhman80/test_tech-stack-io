import { test } from '@playwright/test';
import { HomeSteps } from '../../../steps/ui/main/homeSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';
import { UserSteps } from '../../../steps/ui/main/userSteps.js';

const SITE_TITLE = 'Trainees website';

test.describe('Home page', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
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
