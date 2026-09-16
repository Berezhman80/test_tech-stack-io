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
}
