import { expect, type Page } from '@playwright/test';
import AddAddressDTO from '../DTO/add.address.dto.js';
import AddUserDTO from '../DTO/add.user.dto.js';
import Button from '../locators/components/button.js';
import Header from '../locators/components/header.js';
import Input from '../locators/components/input.js';
import Table from '../locators/components/table.js';
import AddAddressPage from '../locators/pages/addAddressPage.js';
import AddUserPage from '../locators/pages/addUserPage.js';
import DeleteAddressPage from '../locators/pages/deleteAddressPage.js';
import DeleteUserPage from '../locators/pages/deleteUserPage.js';
import HomePage from '../locators/pages/homePage.js';

export class HomeSteps {
  constructor(private page: Page) {}

  async clickLogout(): Promise<void> {
    await this.page.getByTestId(Button.logoutButton).click();
    await this.page.waitForURL(/\/Login/);
  }

  async logout(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure you want to log out?');
      await dialog.accept();
    });

    await this.clickLogout();
  }

  async expectHomePageLoaded(expectedText: string): Promise<void> {
    await expect(this.page.locator(HomePage.siteTitle)).toHaveText(expectedText);
  }

  async expectHeadingAndSubtitle(): Promise<void> {
    await expect(this.page.locator(HomePage.heading)).toBeVisible();
    await expect(this.page.locator(HomePage.subtitle)).toBeVisible();
  }

  async expectHeaderNavigation(): Promise<void> {
    await expect(this.page.getByTestId(Button.homeButton)).toBeVisible();
    await expect(this.page.getByTestId(Header.root).getByTestId(Button.addUser)).toBeVisible();
    await expect(this.page.getByTestId(Header.root).getByTestId(Button.addAddress)).toBeVisible();
    await expect(this.page.getByTestId(Button.logoutButton)).toBeVisible();
  }

  async expectUsersSection(): Promise<void> {
    await expect(this.page.locator(HomePage.usersHeading)).toBeVisible();
    await expect(this.page.getByTestId(Table.users)).toBeVisible();
    await expect(this.page.locator(HomePage.addUserLink)).toBeVisible();
    for (const column of HomePage.usersColumns) {
      await expect(this.page.locator(HomePage.columnHeader(Table.users, column))).toBeVisible();
    }
  }

  async expectUsersTotalMatchesRows(): Promise<void> {
    const rowCount = await this.page.getByTestId(Table.users).getByTestId(Table.userName).count();
    expect(rowCount).toBeGreaterThan(0);
    await expect(this.page.getByTestId(Table.usersTotal)).toHaveText(`Total: ${rowCount}`);
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

  async expectAddressesSection(): Promise<void> {
    await expect(this.page.locator(HomePage.addressesHeading)).toBeVisible();
    await expect(this.page.getByTestId(Table.addresses)).toBeVisible();
    await expect(this.page.locator(HomePage.addAddressLink)).toBeVisible();
    for (const column of HomePage.addressesColumns) {
      await expect(this.page.locator(HomePage.columnHeader(Table.addresses, column))).toBeVisible();
    }
  }

  async expectAddressesTotalMatchesRows(): Promise<void> {
    const rowCount = await this.page
      .getByTestId(Table.addresses)
      .getByTestId(Table.streetAddress)
      .count();
    expect(rowCount).toBeGreaterThan(0);
    await expect(this.page.getByTestId(Table.addressesTotal)).toHaveText(`Total: ${rowCount}`);
  }

  async openAddUserForm(): Promise<void> {
    await this.page.getByTestId(Header.root).getByTestId(Button.addUser).click();
  }

  async openAddAddressForm(): Promise<void> {
    await this.page.getByTestId(Header.root).getByTestId(Button.addAddress).click();
  }

  async expectAddUserFormVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Forms\/User\/AddUser/);
    await expect(this.page.locator(AddUserPage.heading)).toBeVisible();
  }

  async expectAddAddressFormVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Forms\/Address\/AddAddress/);
    await expect(this.page.locator(AddAddressPage.heading)).toBeVisible();
  }

  async addUser(user: AddUserDTO): Promise<void> {
    await this.openAddUserForm();
    await this.expectAddUserFormVisible();
    await this.page.getByTestId(Input.gender).selectOption({ label: user.gender });
    await this.page.getByTestId(Input.userName).fill(user.userName);
    await this.page.getByTestId(Input.yearOfBirth).fill(user.yearOfBirth);
    await this.page.getByTestId(Button.create).click();
    await this.page.waitForURL((url) => url.pathname === '/');
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

  async deleteUser(user: AddUserDTO): Promise<void> {
    await this.page.locator(HomePage.userRowDelete(user.userName)).click();
    await expect(this.page).toHaveURL(/\/Forms\/User\/DeleteUser\//);
    await expect(this.page.locator(DeleteUserPage.heading)).toBeVisible();
    await expect(this.page.locator(DeleteUserPage.confirmName(user.userName))).toBeVisible();
    await this.page.locator(DeleteUserPage.yesButton).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async addAddress(address: AddAddressDTO): Promise<void> {
    await this.openAddAddressForm();
    await this.expectAddAddressFormVisible();
    await this.page.locator(AddAddressPage.street).fill(address.street);
    await this.page.locator(AddAddressPage.city).fill(address.city);
    await this.page.locator(AddAddressPage.state).fill(address.state);
    await this.page.locator(AddAddressPage.zipCode).fill(address.zipCode);
    await this.page.locator(AddAddressPage.createButton).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async expectAddressInTable(address: AddAddressDTO): Promise<void> {
    const row = this.page.locator(HomePage.addressRow(address.street));
    await expect(row).toBeVisible();
    await expect(row.getByTestId(Table.streetAddress)).toHaveText(address.street);
    await expect(row.getByTestId(Table.city)).toHaveText(address.city);
    await expect(row.getByTestId(Table.state)).toHaveText(address.state);
    await expect(row.getByTestId(Table.zipCode)).toHaveText(address.zipCode);
  }

  async expectAddressNotInTable(address: AddAddressDTO): Promise<void> {
    await expect(this.page.locator(HomePage.streetAddressCell(address.street))).toHaveCount(0);
  }

  async deleteAddress(address: AddAddressDTO): Promise<void> {
    await this.page.locator(HomePage.addressRowDelete(address.street)).click();
    await expect(this.page).toHaveURL(/\/Forms\/Address\/DeleteAddress\//);
    await expect(this.page.locator(DeleteAddressPage.heading)).toBeVisible();
    await expect(this.page.locator(DeleteAddressPage.confirmStreet(address.street))).toBeVisible();
    await this.page.getByTestId(Button.yes).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }
}
