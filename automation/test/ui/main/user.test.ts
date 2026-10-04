import { test } from '@playwright/test';
import { HomeSteps } from '../../../steps/ui/main/homeSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';
import { UserSteps } from '../../../steps/ui/main/userSteps.js';
import AddUserDTO from '../../../dto/user/add.user.dto.js';

const SITE_TITLE = 'Trainees website';

test.describe('Users', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
  let homeSteps: HomeSteps;
  let userSteps: UserSteps;
  let createdUser: AddUserDTO | undefined;

  test.beforeEach(async ({ page }) => {
    const loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);
    userSteps = new UserSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithAdminCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test.afterEach(async ({ page }) => {
    if (!createdUser) {
      return;
    }

    await page.goto('/');
    await userSteps.deleteUser(createdUser);
    createdUser = undefined;
  });

  test('Check that a new user can be added', async () => {
    const user = new AddUserDTO();

    user.userName = 'Oleksandr';
    user.yearOfBirth = '1980';
    user.gender = 'Male';

    await userSteps.addUser(user);

    createdUser = user;

    await userSteps.expectUserInTable(user);
  });

  test('Check that a user can be edited', async () => {
    const user = new AddUserDTO();
    const uniqueId = Date.now().toString().slice(-8);

    user.userName = `Auto${uniqueId}`;
    user.yearOfBirth = '1995';
    user.gender = 'Male';

    await userSteps.addUser(user);
    await userSteps.expectUserInTable(user);
    createdUser = user;

    const updated = new AddUserDTO();

    updated.userName = `Edit${uniqueId}`;
    updated.yearOfBirth = '2001';
    updated.gender = 'Female';

    await userSteps.editUser(user, updated);
    createdUser = updated;

    await userSteps.expectUserNotInTable(user);
    await userSteps.expectUserInTable(updated);
  });

  test('Check that a new user can be deleted', async () => {
    const user = new AddUserDTO();

    const uniqueId = Date.now().toString().slice(-8);

    user.userName = `Auto${uniqueId}`;
    user.yearOfBirth = '1995';
    user.gender = 'Male';

    await userSteps.addUser(user);
    await userSteps.expectUserInTable(user);

    await userSteps.deleteUser(user);
    await userSteps.expectUserNotInTable(user);
  });
});
