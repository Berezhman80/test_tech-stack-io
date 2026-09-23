import { test } from '@playwright/test';
import { HomeSteps } from '../steps/homeSteps.js';
import { LoginSteps } from '../steps/loginSteps.js';
import SignInPage from '../locators/pages/signInPage.js';

const SITE_TITLE = 'Trainees website';

test.describe('Login', () => {
  let loginSteps: LoginSteps;
  let homeSteps: HomeSteps;

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
  });

  test('Check that Login works', async () => {
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that Logout works', async () => {
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);

    await homeSteps.logout();
    await loginSteps.expectSignInFormVisible();
  });

  test('Check that empty fields show required confirmations', async () => {
    await loginSteps.submitEmptyForm();

    await loginSteps.expectUsernameRequiredMessage();
    await loginSteps.expectPasswordRequiredMessage();
  });

  test('Check that empty username shows confirmation', async ({ page }) => {
    await loginSteps.fillLoginInputs(undefined, process.env.PASSWORD);
    await page.locator(SignInPage.signInButton).click();
    await loginSteps.expectUsernameRequiredMessage();
  });

  test('Check that empty password shows confirmation', async ({ page }) => {
    await loginSteps.fillLoginInputs(process.env.LOGIN, undefined);
    await page.locator(SignInPage.signInButton).click();
    await loginSteps.expectPasswordRequiredMessage();
  });
});
