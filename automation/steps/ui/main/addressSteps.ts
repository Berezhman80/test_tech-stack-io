import { expect, type Page } from '@playwright/test';
import Button from '../../../identifiers/components/button.js';
import Table from '../../../identifiers/components/table.js';
import AddAddressPage from '../../../identifiers/pages/main/address/addAddressPage.js';
import DeleteAddressPage from '../../../identifiers/pages/main/address/deleteAddressPage.js';
import HomePage from '../../../identifiers/pages/main/home/homePage.js';
import type AddressDto from '../../../dto/address/address.dto.js';
import { HomeSteps } from './homeSteps.js';

export class AddressSteps {
  private readonly homeSteps: HomeSteps;

  constructor(private page: Page) {
    this.homeSteps = new HomeSteps(page);
  }

  async addAddress(address: AddressDto): Promise<void> {
    await this.homeSteps.openAddAddressForm();
    await this.homeSteps.expectAddAddressFormVisible();
    await this.page.locator(AddAddressPage.street).fill(address.streetAddress);
    await this.page.locator(AddAddressPage.city).fill(address.city);
    await this.page.locator(AddAddressPage.state).fill(address.state);
    await this.page.locator(AddAddressPage.zipCode).fill(address.zipCode);
    await this.page.locator(AddAddressPage.createButton).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }

  async expectAddressInTable(address: AddressDto): Promise<void> {
    const row = this.page.locator(HomePage.addressRow(address.streetAddress));
    await expect(row).toBeVisible();
    await expect(row.getByTestId(Table.streetAddress)).toHaveText(address.streetAddress);
    await expect(row.getByTestId(Table.city)).toHaveText(address.city);
    await expect(row.getByTestId(Table.state)).toHaveText(address.state);
    await expect(row.getByTestId(Table.zipCode)).toHaveText(address.zipCode);
  }

  async expectAddressNotInTable(address: AddressDto): Promise<void> {
    await expect(this.page.locator(HomePage.streetAddressCell(address.streetAddress))).toHaveCount(
      0,
    );
  }

  async deleteAddress(address: AddressDto): Promise<void> {
    await this.page.locator(HomePage.addressRowDelete(address.streetAddress)).click();
    await expect(this.page).toHaveURL(/\/Forms\/Address\/DeleteAddress\//);
    await expect(this.page.locator(DeleteAddressPage.heading)).toBeVisible();
    await expect(
      this.page.locator(DeleteAddressPage.confirmStreet(address.streetAddress)),
    ).toBeVisible();
    await this.page.getByTestId(Button.yes).click();
    await this.page.waitForURL((url) => url.pathname === '/');
  }
}
