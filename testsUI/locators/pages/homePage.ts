import Button from '../components/button.js';
import Table from '../components/table.js';

export default class HomePage {
  static heading = '//h1[normalize-space()="Users and Addresses"]';
  static subtitle =
    '//h1[normalize-space()="Users and Addresses"]/following-sibling::div[contains(@class, "text-muted")]';
  static siteTitle =
    '//*[@data-testid="header"]//a[contains(@class, "navbar-brand")]';
  static usersHeading = '//h2[normalize-space()="Users"]';
  static addressesHeading = '//h2[normalize-space()="Addresses"]';
  static addUserLink = '//a[normalize-space()="+ Add user"]';
  static addAddressLink = '//a[normalize-space()="+ Add address"]';
  static logoutLink =
    '//*[@data-testid="logout-button"]//a[normalize-space()="Logout"]';
  static usersColumns = [
    "User Name",
    "Year of Birth",
    "Gender",
    "Actions",
  ] as const;
  static addressesColumns = [
    "Street Address",
    "City",
    "State",
    "Zip Code",
    "Actions",
  ] as const;

  static columnHeader = (tableTestId: string, name: string) =>
    `//*[@data-testid="${tableTestId}"]//th[normalize-space()="${name}"]`;

  static userRow = (userName: string) =>
    `//*[@data-testid="${Table.users}"]//tr[.//*[@data-testid="${Table.userName}" and normalize-space()="${userName}"]]`;

  static userRowDelete = (userName: string) =>
    `${HomePage.userRow(userName)}//*[@data-testid="${Button.delete}"]`;

  static userNameCell = (userName: string) =>
    `//*[@data-testid="${Table.users}"]//*[@data-testid="${Table.userName}" and normalize-space()="${userName}"]`;

  static addressRow = (street: string) =>
    `//*[@data-testid="${Table.addresses}"]//tr[.//*[@data-testid="${Table.streetAddress}" and normalize-space()="${street}"]]`;

  static addressRowDelete = (street: string) =>
    `${HomePage.addressRow(street)}//*[@data-testid="${Button.delete}"]`;

  static streetAddressCell = (street: string) =>
    `//*[@data-testid="${Table.addresses}"]//*[@data-testid="${Table.streetAddress}" and normalize-space()="${street}"]`;
}
