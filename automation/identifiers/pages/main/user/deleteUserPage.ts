export default class DeleteUserPage {
  static heading = '//h1[normalize-space()="Delete User"]';
  static confirmName = (userName: string) => `//strong[normalize-space()="${userName}"]`;
  static yesButton = '//button[@type="submit" and normalize-space()="Yes"]';
}
