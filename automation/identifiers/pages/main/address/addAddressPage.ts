export default class AddAddressPage {
  static heading = '//h3[normalize-space()="Add Address"]';
  static street = '//input[@id="Address_StreetAddress"]';
  static city = '//input[@id="Address_City"]';
  static state = '//input[@id="Address_State"]';
  static zipCode = '//input[@id="Address_ZipCode"]';
  static createButton = '//button[@type="submit" and normalize-space()="Create"]';
  static streetError = '//span[@data-valmsg-for="Address.StreetAddress"]';
  static cityError = '//span[@data-valmsg-for="Address.City"]';
  static stateError = '//span[@data-valmsg-for="Address.State"]';
  static zipCodeError = '//span[@data-valmsg-for="Address.ZipCode"]';
}
