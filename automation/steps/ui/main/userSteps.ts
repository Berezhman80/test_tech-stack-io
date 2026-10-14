import { expect, type Page } from '@playwright/test';
import Button from '../../../identifiers/components/button.js';
import Input from '../../../identifiers/components/input.js';
import Table from '../../../identifiers/components/table.js';
import DeleteUserPage from '../../../identifiers/pages/main/user/deleteUserPage.js';
import EditUserPage from '../../../identifiers/pages/main/user/editUserPage.js';
import HomePage from '../../../identifiers/pages/main/home/homePage.js';
import AddUserDTO from '../../../dto/user/add.user.dto.js';
import { HomeSteps } from './homeSteps.js';

export class UserSteps {
  private readonly homeSteps: HomeSteps;

  constructor(private page: Page) {
    this.homeSteps = new HomeSteps(page);
  }

  async expectSeedUsers(): Promise<void> {
    const oleg = new AddUserDTO();
    oleg.userName = 'Oleg';
    oleg.yearOfBirth = '1993';
    oleg.gender = 'Male';

    const dasha = new AddUserDTO();
    dasha.userName = 'Dasha';
    dasha.yearOfBirth = '1992';
    dasha.gender = 'Female';

    const oksana = new AddUserDTO();
    oksana.userName = 'Oksana';
    oksana.yearOfBirth = '1996';
    oksana.gender = 'Female';

    const vitalii = new AddUserDTO();
    vitalii.userName = 'Vitalii';
    vitalii.yearOfBirth = '1990';
    vitalii.gender = 'Male';

    for (const user of [oleg, dasha, oksana, vitalii]) {
      await this.expectUserInTable(user);
    }
  }

  async addUser(user: AddUserDTO): Promise<void> {
    await this.homeSteps.openAddUserForm();
    await this.homeSteps.expectAddUserFormVisible();
    await this.page.getByTestId(Input.gender).selectOption({ label: user.gender });
    await this.page.getByTestId(Input.userName).fill(user.userName);
    await this.page.getByTestId(Input.yearOfBirth).fill(user.yearOfBirth);
    await this.page.getByTestId(Button.create).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async submitAddUserForm(user: AddUserDTO): Promise<void> {
    await this.page.goto('/');
    await this.homeSteps.openAddUserForm();
    await this.homeSteps.expectAddUserFormVisible();
    await this.page.getByTestId(Input.gender).selectOption({ label: user.gender });
    await this.page.getByTestId(Input.userName).fill(user.userName);
    await this.page.getByTestId(Input.yearOfBirth).fill(user.yearOfBirth);
    await this.page.getByTestId(Button.create).click();
  }

  async expectCreatedUser(user: AddUserDTO): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === '/');
    await this.expectUserInTable(user);
  }

  async expectAddUserCase(
    user: AddUserDTO,
    nameError?: string,
    yearError?: string,
  ): Promise<AddUserDTO[]> {
    await this.submitAddUserForm(user);

    if (nameError || yearError) {
      await this.expectUserValidation(nameError, yearError);
      return [];
    }

    await this.expectCreatedUser(user);
    return [user];
  }

  async expectUserValidation(nameError?: string, yearError?: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/Forms\/User\/AddUser/);

    const name = this.page.getByTestId(Input.userNameError);
    const year = this.page.getByTestId(Input.yearOfBirthError);

    if (nameError) {
      await expect(name).toHaveText(nameError);
    } else {
      await expect(name).toBeEmpty();
    }

    if (yearError) {
      await expect(year).toHaveText(yearError);
    } else {
      await expect(year).toBeEmpty();
    }
  }

  async expectUserInTable(user: AddUserDTO): Promise<void> {
    const row = this.page.locator(HomePage.userRow(user.userName));
    await expect(row).toBeVisible();
    await expect(row.getByTestId(Table.userName)).toHaveText(user.userName);
    await expect(row.getByTestId(Table.yearOfBirth)).toHaveText(user.yearOfBirth);
    await expect(row.getByTestId(Table.gender)).toHaveText(user.gender);
  }

  async expectUserNotInTable(user: AddUserDTO): Promise<void> {
    await expect(this.page.locator(HomePage.userNameCell(user.userName))).toHaveCount(0);
  }

  async editUser(current: AddUserDTO, updated: AddUserDTO): Promise<void> {
    await this.page.locator(HomePage.userRowEdit(current.userName)).click();
    await expect(this.page).toHaveURL(/\/Forms\/User\/EditUser\//);
    await expect(this.page.locator(EditUserPage.heading)).toBeVisible();
    await this.page.getByTestId(Input.gender).selectOption({ label: updated.gender });
    await this.page.getByTestId(Input.userName).fill(updated.userName);
    await this.page.getByTestId(Input.yearOfBirth).fill(updated.yearOfBirth);
    await this.page.getByTestId(Button.update).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async deleteUser(user: AddUserDTO): Promise<void> {
    await this.page.locator(HomePage.userRowDelete(user.userName)).click();
    await expect(this.page).toHaveURL(/\/Forms\/User\/DeleteUser\//);
    await expect(this.page.locator(DeleteUserPage.heading)).toBeVisible();
    await expect(this.page.locator(DeleteUserPage.confirmName(user.userName))).toBeVisible();
    await this.page.locator(DeleteUserPage.yesButton).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }
}
