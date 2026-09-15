import { test } from '@playwright/test';
import { HomeSteps } from '../steps/homeSteps.js';
import { LoginSteps } from '../steps/loginSteps.js';

test('Check that the home page heading is displayed', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();

  await homeSteps.expectHomePageLoaded('Trainees website');
  await homeSteps.expectHeadingAndSubtitle();
});

test('Check that the header navigation is visible', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();

  await homeSteps.expectHomePageLoaded('Trainees website');
  await homeSteps.expectHeaderNavigation();
});

test('Check that the Users table is displayed', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();

  await homeSteps.expectHomePageLoaded('Trainees website');
  await homeSteps.expectUsersSection();
  await homeSteps.expectSeedUsers();
});

test('Check that the users total matches the table rows', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();

  await homeSteps.expectHomePageLoaded('Trainees website');
  await homeSteps.expectUsersTotalMatchesRows();
});

test('Check that the Addresses table is displayed', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();

  await homeSteps.expectHomePageLoaded('Trainees website');
  await homeSteps.expectAddressesSection();
  await homeSteps.expectAddressesTotalMatchesRows();
});

test('Check that Add User opens the create form', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();
  await homeSteps.expectHomePageLoaded('Trainees website');

  await homeSteps.openAddUserForm();
  await homeSteps.expectAddUserFormVisible();
});

test('Check that Add Address opens the create form', async ({ page }) => {
  const loginSteps = new LoginSteps(page);
  const homeSteps = new HomeSteps(page);

  await loginSteps.openLoginPage();
  await loginSteps.loginWithValidCredentials();
  await homeSteps.expectHomePageLoaded('Trainees website');

  await homeSteps.openAddAddressForm();
  await homeSteps.expectAddAddressFormVisible();
});