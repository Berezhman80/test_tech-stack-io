export default class AddAddressPage {
  static heading = '//h3[normalize-space()="Add Address"]';
  static street = '//input[@id="Address_StreetAddress"]';
  static city = '//input[@id="Address_City"]';
  static state = '//input[@id="Address_State"]';
  static zipCode = '//input[@id="Address_ZipCode"]';
  static createButton = '//form//button[@type="submit" and normalize-space()="Create"]';
}
