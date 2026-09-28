import { expect, test } from '@playwright/test';
import { HomeSteps } from '../steps/homeSteps.js';
import { LoginSteps } from '../steps/loginSteps.js';
import { AddressApiSteps } from '../../testsAPI/steps/addressApiSteps.js';
import { AuthApiSteps } from '../../testsAPI/steps/authApiSteps.js';
import { UserApiSteps } from '../../testsAPI/steps/userApiSteps.js';
import AddressDto from '../../commonDto/DTO/address.dto.js';
import AddUserDTO from '../DTO/add.user.dto.js';
import AddressResponseDto from '../../testsAPI/DTO/address.response.dto.js';
import UserRequestDto from '../../testsAPI/DTO/user.request.dto.js';
import UserResponseDto from '../../testsAPI/DTO/user.response.dto.js';

const SITE_TITLE = 'Trainees website';

test.describe('UI and API for Users', () => {
  let user: AddUserDTO | undefined;
  let token: string | undefined;
  let createdId: string | undefined;
  let homeSteps: HomeSteps;
  let loginSteps: LoginSteps;

  test.beforeEach(async ({ request, page }) => {
    const authApiSteps = new AuthApiSteps(request);
    const userApiSteps = new UserApiSteps(request);
    token = await authApiSteps.getValidAccessToken();

    user = new AddUserDTO();
    user.userName = `Auto${Date.now().toString().slice(-8)}`;
    user.yearOfBirth = '1995';
    user.gender = 'Male';

    const requestUser = new UserRequestDto();
    requestUser.name = user.userName;
    requestUser.yearOfBirth = Number(user.yearOfBirth);
    requestUser.gender = 1;

    const response = await userApiSteps.createUser(token, requestUser);

    expect(response.status()).toBe(200);

    const created = (await response.json()) as UserResponseDto;
    createdId = created.id;

    loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that a user created via API is visible in the UI', async ({ page }) => {
    homeSteps = new HomeSteps(page);

    await homeSteps.expectUsersSection();
    await homeSteps.expectUserInTable(user!);
  });

  test('Check via API that a user edited in the UI has the new values', async ({
    page,
    request,
  }) => {
    homeSteps = new HomeSteps(page);

    const updated = new AddUserDTO();
    updated.userName = `Edit${Date.now().toString().slice(-8)}`;
    updated.yearOfBirth = '2001';
    updated.gender = 'Female';

    await homeSteps.editUser(user!, updated);

    const userApiSteps = new UserApiSteps(request);
    const response = await userApiSteps.getUserById(token!, createdId!);

    expect(response.status()).toBe(200);

    const fetched = (await response.json()) as UserResponseDto;

    expect(fetched).toMatchObject({
      id: createdId,
      name: updated.userName,
      yearOfBirth: Number(updated.yearOfBirth),
      gender: 2,
    });
  });

  test.afterEach(async ({ request }) => {
    if (!createdId) {
      return;
    }

    const authApiSteps = new AuthApiSteps(request);
    const userApiSteps = new UserApiSteps(request);
    const adminToken = await authApiSteps.getAdminAccessToken();

    await userApiSteps.deleteUser(adminToken, createdId);

    const response = await userApiSteps.getUserById(token!, createdId);
    expect(response.status()).toBe(404);
  });
});

test.describe('UI and API for Addresses', () => {
  let address: AddressDto | undefined;
  let token: string | undefined;
  let createdId: string | undefined;
  let homeSteps: HomeSteps;
  let loginSteps: LoginSteps;

  test.beforeEach(async ({ request, page }) => {
    const authApiSteps = new AuthApiSteps(request);
    const addressApiSteps = new AddressApiSteps(request);
    token = await authApiSteps.getValidAccessToken();
    address = new AddressDto();

    address.streetAddress = `Street ${Date.now().toString().slice(-8)}`;
    address.city = 'Kharkiv';
    address.state = 'UA';
    address.zipCode = '61000';

    const response = await addressApiSteps.createAddress(token, address);

    expect(response.status()).toBe(200);

    const created = (await response.json()) as AddressResponseDto;
    createdId = created.id;

    loginSteps = new LoginSteps(page);
    homeSteps = new HomeSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that an address created via API is visible in the UI', async ({ page }) => {
    homeSteps = new HomeSteps(page);

    await homeSteps.expectAddressesSection();
    await homeSteps.expectAddressInTable(address!);
  });

  test.afterEach(async ({ request }) => {
    if (!createdId) {
      return;
    }

    const authApiSteps = new AuthApiSteps(request);
    const addressApiSteps = new AddressApiSteps(request);
    const adminToken = await authApiSteps.getAdminAccessToken();

    await addressApiSteps.deleteAddress(adminToken, createdId);

    const response = await addressApiSteps.getAddressById(token!, createdId);
    expect(response.status()).toBe(404);
  });
});
