import { expect, test } from '@playwright/test';
import UserResponseDto from '../DTO/user.response.dto.js';
import { AuthApiSteps } from '../steps/authApiSteps.js';
import { UserApiSteps } from '../steps/userApiSteps.js';

test.describe('User API', () => {
  let authApiSteps: AuthApiSteps;
  let userApiSteps: UserApiSteps;

  test.beforeEach(async ({ request }) => {
    authApiSteps = new AuthApiSteps(request);
    userApiSteps = new UserApiSteps(request);
  });

  test('Check that the users list is returned', async () => {
    const token = await authApiSteps.getValidAccessToken();
    const response = await userApiSteps.getUsers(token);

    expect(response.status()).toBe(200);

    const users = (await response.json()) as UserResponseDto[];

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(4);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Oleg', yearOfBirth: 1993, gender: 1 }),
        expect.objectContaining({ name: 'Dasha', yearOfBirth: 1992, gender: 2 }),
        expect.objectContaining({ name: 'Oksana', yearOfBirth: 1996, gender: 2 }),
        expect.objectContaining({ name: 'Vitalii', yearOfBirth: 1990, gender: 1 }),
      ]),
    );
  });

  test('Check that users cannot be requested without a token', async () => {
    const response = await userApiSteps.getUsers();

    expect(response.status()).toBe(401);
  });

  test.describe('User CRUD', () => {
    let token: string;
    let adminToken: string;
    let createdId: string | undefined;

    test.beforeEach(async () => {
      createdId = undefined;
      token = await authApiSteps.getValidAccessToken();
      adminToken = await authApiSteps.getAdminAccessToken();
    });

    test.afterEach(async () => {
      if (createdId) {
        await userApiSteps.deleteUser(adminToken, createdId);
      }
    });

    test('Check that a user can be created', async () => {
      const user = userApiSteps.buildUser('Created');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      expect(created.id).toEqual(expect.any(String));
      expect(created).toMatchObject({
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        gender: user.gender,
      });
    });

    test('Check that a created user can be retrieved by id', async () => {
      const user = userApiSteps.buildUser('GetById');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      const response = await userApiSteps.getUserById(token, created.id);

      expect(response.status()).toBe(200);

      const fetched = (await response.json()) as UserResponseDto;

      expect(fetched).toMatchObject({
        id: created.id,
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        gender: user.gender,
      });
    });

    test('Check that a user can be updated', async () => {
      const user = userApiSteps.buildUser('Upd');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      const updatedUser = userApiSteps.buildUser('Upd');
      updatedUser.yearOfBirth = 1988;
      updatedUser.gender = 2;

      const updateResponse = await userApiSteps.updateUser(token, created.id, updatedUser);

      expect(updateResponse.status()).toBe(200);

      const getAfterUpdate = await userApiSteps.getUserById(token, created.id);

      expect(getAfterUpdate.status()).toBe(200);

      const updated = (await getAfterUpdate.json()) as UserResponseDto;

      expect(updated).toMatchObject({
        id: created.id,
        name: updatedUser.name,
        yearOfBirth: updatedUser.yearOfBirth,
        gender: updatedUser.gender,
      });
    });

    test('Check that a user cannot be deleted without admin rights', async () => {
      const user = userApiSteps.buildUser('UserDelete');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      const response = await userApiSteps.deleteUser(token, created.id);

      expect(response.status()).toBe(403);
    });

    test('Check that an admin can delete a user', async () => {
      const user = userApiSteps.buildUser('AdminDelete');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      const response = await userApiSteps.deleteUser(adminToken, created.id);

      expect(response.status()).toBe(200);
    });

    test('Check that a deleted user cannot be retrieved', async () => {
      const user = userApiSteps.buildUser('404');
      const created = await userApiSteps.createUserForTest(token, user);
      createdId = created.id;

      await userApiSteps.deleteUser(adminToken, created.id);

      const response = await userApiSteps.getUserById(token, created.id);

      expect(response.status()).toBe(404);
    });
  });
});
