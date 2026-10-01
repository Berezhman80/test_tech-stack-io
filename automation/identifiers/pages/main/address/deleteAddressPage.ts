export default class DeleteAddressPage {
  static heading = '//h1[normalize-space()="Delete Address"]';
  static confirmStreet = (street: string) => `//strong[normalize-space()="${street}"]`;
}
