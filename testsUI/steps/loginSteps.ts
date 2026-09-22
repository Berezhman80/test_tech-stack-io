import { expect, type Page } from '@playwright/test';
import Input from '../locators/components/input.js';
import SignInPage from '../locators/pages/signInPage.js';
import UserDTO from '../DTO/user.dto.js';

export class LoginSteps {
  constructor(private page: Page) {}

  async openLoginPage(): Promise<void> {
    await this.page.goto('/Login');
  }

  async login(user: UserDTO): Promise<void> {
    await this.page.getByTestId(Input.username).getByTestId(Input.field).fill(user.username);
    await this.page.getByTestId(Input.password).getByTestId(Input.field).fill(user.password);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login(this.getValidUser());
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async loginWithAdminCredentials(): Promise<void> {
    await this.login(this.getAdminUser());
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.locator(SignInPage.signInButton).click();
  }

  async submitWithPasswordOnly(): Promise<void> {
    const user = this.getValidUser();
    await this.page.getByTestId(Input.password).getByTestId(Input.field).fill(user.password);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async submitWithUsernameOnly(): Promise<void> {
    const user = this.getValidUser();
    await this.page.getByTestId(Input.username).getByTestId(Input.field).fill(user.username);
    await this.page.locator(SignInPage.signInButton).click();
  }

  async expectSignInFormVisible(): Promise<void> {
    await expect(this.page.locator(SignInPage.title)).toHaveText('Sign in');
  }

  async expectUsernameRequiredMessage(): Promise<void> {
    await expect(this.page.getByTestId(Input.username).getByTestId(Input.errorMsg)).toHaveText(
      'Username is required.',
    );
  }

  async expectPasswordRequiredMessage(): Promise<void> {
    await expect(this.page.getByTestId(Input.password).getByTestId(Input.errorMsg)).toHaveText(
      'Password is required.',
    );
  }

  private getValidUser(): UserDTO {
    const user = new UserDTO();
    user.username = process.env.LOGIN ?? '';
    user.password = process.env.PASSWORD ?? '';

    if (!user.username || !user.password) {
      throw new Error('LOGIN and PASSWORD environment variables must be set');
    }

    return user;
  }

  private getAdminUser(): UserDTO {
    const user = new UserDTO();
    user.username = process.env.ADMIN_LOGIN ?? '';
    user.password = process.env.ADMIN_PASSWORD ?? '';

    if (!user.username || !user.password) {
      throw new Error('ADMIN_LOGIN and ADMIN_PASSWORD environment variables must be set');
    }

    return user;
  }
}
