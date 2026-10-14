import { test } from '@playwright/test';
import { AuthApiSteps } from '../../../steps/api/authApiSteps.js';
import { LoginSteps } from '../../../steps/ui/login/loginSteps.js';
import { UserSteps } from '../../../steps/ui/main/userSteps.js';
import AddUserDTO from '../../../dto/user/add.user.dto.js';

test.describe('Users', { tag: ['@desktop', '@mobile', '@regression'] }, () => {
  let userSteps: UserSteps;
  let createdUsers: AddUserDTO[] = [];

  test.beforeEach(async ({ page, request }) => {
    const authApiSteps = new AuthApiSteps(request);
    const loginSteps = new LoginSteps(page);
    userSteps = new UserSteps(page);

    const token = await authApiSteps.getAdminAccessToken();
    await loginSteps.openHomeWithAccessToken(token);
  });

  test.afterEach(async ({ page }) => {
    for (const user of createdUsers) {
      await page.goto('/');
      await userSteps.deleteUser(user);
    }

    createdUsers = [];
  });

  test('Check that a new user can be added', async () => {
    const user = new AddUserDTO();

    user.userName = 'Oleksandr';
    user.yearOfBirth = '1980';
    user.gender = 'Male';

    await userSteps.addUser(user);

    createdUsers = [user];

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
    createdUsers = [user];

    const updated = new AddUserDTO();

    updated.userName = `Edit${uniqueId}`;
    updated.yearOfBirth = '2001';
    updated.gender = 'Female';

    await userSteps.editUser(user, updated);
    createdUsers = [updated];

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

  test('Check that a too short user name is rejected', async () => {
    const user = new AddUserDTO();

    user.gender = 'Male';
    // A valid User Name is 3 to 14 characters long.
    user.userName = 'Sa';
    user.yearOfBirth = '1980';

    await userSteps.submitAddUserForm(user);
    await userSteps.expectUserValidation('Name is too short');
  });

  test('Check the year of birth boundaries', async () => {
    // A valid Year of Birth is from 1900 to 2005.
    const boundaries = [
      { year: '1899', yearError: 'Not valid Year of Birth is set' },
      { year: '1900' },
      { year: '1901' },
      { year: '2004' },
      { year: '2005' },
      { year: '2006', yearError: 'Not valid Year of Birth is set' },
    ];

    for (const boundary of boundaries) {
      const user = new AddUserDTO();

      user.gender = 'Male';
      user.userName = `Y${boundary.year}${Date.now().toString().slice(-4)}`;
      user.yearOfBirth = boundary.year;

      const saved = await userSteps.expectAddUserCase(user, undefined, boundary.yearError);
      createdUsers.push(...saved);
    }
  });

  test('Check Add User combinations using pairwise data', async () => {
    const validNameA = `Ann${Date.now().toString().slice(-6)}`;
    const validNameB = `Ian${Date.now().toString().slice(-6)}`;
    const cases: PairwiseUserCase[] = [
      { gender: 'Undefined', userName: validNameA, yearOfBirth: '2000' },
      {
        gender: 'Undefined',
        userName: 'Sa',
        yearOfBirth: '1899',
        nameError: 'Name is too short',
        yearError: 'Not valid Year of Birth is set',
      },
      {
        gender: 'Male',
        userName: 'Sasha',
        yearOfBirth: '1899',
        yearError: 'Not valid Year of Birth is set',
      },
      { gender: 'Male', userName: 'Sa', yearOfBirth: '2000', nameError: 'Name is too short' },
      { gender: 'Female', userName: validNameB, yearOfBirth: '2000' },
      {
        gender: 'Female',
        userName: 'Sa',
        yearOfBirth: '1899',
        nameError: 'Name is too short',
        yearError: 'Not valid Year of Birth is set',
      },
    ];

    for (const data of cases) {
      const user = new AddUserDTO();

      user.gender = data.gender;
      user.userName = data.userName;
      user.yearOfBirth = data.yearOfBirth;

      const saved = await userSteps.expectAddUserCase(user, data.nameError, data.yearError);
      createdUsers.push(...saved);
    }
  });
});

interface PairwiseUserCase {
  gender: AddUserDTO['gender'];
  userName: string;
  yearOfBirth: string;
  nameError?: string;
  yearError?: string;
}
