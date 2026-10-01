import { expect, type Page } from '@playwright/test';
import Button from '../../../identifiers/components/button.js';
import Header from '../../../identifiers/components/header.js';
import Table from '../../../identifiers/components/table.js';
import AddAddressPage from '../../../identifiers/pages/main/address/addAddressPage.js';
import AddUserPage from '../../../identifiers/pages/main/user/addUserPage.js';
import HomePage from '../../../identifiers/pages/main/home/homePage.js';

export class HomeSteps {
  constructor(private page: Page) {}

  async openNavigationIfCollapsed(): Promise<void> {
    const homeButton = this.page.getByTestId(Button.homeButton);

    if (await homeButton.isVisible()) {
      return;
    }

    await this.page.locator(HomePage.menuButton).click();
    await expect(homeButton).toBeVisible();
  }

  async clickLogout(): Promise<void> {
    await this.openNavigationIfCollapsed();
    await this.page.locator(HomePage.logoutLink).click();
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
    await this.openNavigationIfCollapsed();
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
    await this.openNavigationIfCollapsed();
    await this.page.getByTestId(Header.root).getByTestId(Button.addUser).click();
  }

  async openAddAddressForm(): Promise<void> {
    await this.openNavigationIfCollapsed();
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
}
