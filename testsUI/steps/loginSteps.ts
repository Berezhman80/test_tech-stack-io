import { expect, type Page } from '@playwright/test';
import Input from '../locators/components/input.js';
import SignInPage from '../locators/pages/signInPage.js';

export class LoginSteps {
  constructor(private page: Page) { }

  async openLoginPage(): Promise<void> {
    await this.page.goto('/Login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId(Input.username).getByTestId(Input.field).fill(username);
    await this.page.getByTestId(Input.password).getByTestId(Input.field).fill(password);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async loginWithValidCredentials(): Promise<void> {
    const { username, password } = this.getCredentials();
    await this.login(username, password);
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.locator(SignInPage.signInButton).click();
  }

  async submitWithPasswordOnly(): Promise<void> {
    await this.page.getByTestId(Input.password).getByTestId(Input.field).fill(this.getCredentials().password);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async submitWithUsernameOnly(): Promise<void> {
    await this.page.getByTestId(Input.username).getByTestId(Input.field).fill(this.getCredentials().username);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async expectSignInFormVisible(): Promise<void> {
    await expect(this.page.locator(SignInPage.title)).toHaveText('Sign in');
  }

  async expectUsernameRequiredMessage(): Promise<void> {
    await expect(this.page.getByTestId(Input.username).getByTestId(Input.errorMsg)).toHaveText('Username is required.');
  }

  async expectPasswordRequiredMessage(): Promise<void> {
    await expect(this.page.getByTestId(Input.password).getByTestId(Input.errorMsg)).toHaveText('Password is required.');
  }

  private getCredentials(): { username: string; password: string } {
    const username = process.env.LOGIN;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error('LOGIN and PASSWORD environment variables must be set');
    }

    return { username, password };
  }
}
