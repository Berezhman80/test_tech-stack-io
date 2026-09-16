import { expect, test } from '@playwright/test';
import SignInPage from '../locators/pages/signInPage.js';
import { HomeSteps } from '../steps/homeSteps.js';
import { LoginSteps } from '../steps/loginSteps.js';

test.describe('Login', () => {
  test('Check that Login Works', async ({ page }) => {
    const loginSteps = new LoginSteps(page);
    const homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();

    await homeSteps.expectHomePageLoaded('Trainees website');
  });

  test('Check that Logout Works', async ({ page }) => {
    const loginSteps = new LoginSteps(page);
    const homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();

    await homeSteps.expectHomePageLoaded('Trainees website');

    // Playwright готується обробити системне вікно
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure you want to log out?');

      // Натиснути OK
      await dialog.accept();
    });

    // Після цього натискання з’явиться системне вікно
    await homeSteps.clickLogout();

    // Перевірка успішного виходу
    await expect(page.locator(SignInPage.title)).toBeVisible();
  });

  test('Check that empty fields show required confirmations', async ({ page }) => {
    const loginSteps = new LoginSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.submitEmptyForm();

    await loginSteps.expectUsernameRequiredMessage();
    await loginSteps.expectPasswordRequiredMessage();
  });

  test('Check that empty username shows confirmation', async ({ page }) => {
    const loginSteps = new LoginSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.submitWithPasswordOnly();

    await loginSteps.expectUsernameRequiredMessage();
  });

  test('Check empty password shows confirmation', async ({ page }) => {
    const loginSteps = new LoginSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.submitWithUsernameOnly();

    await loginSteps.expectPasswordRequiredMessage();
  });
});
