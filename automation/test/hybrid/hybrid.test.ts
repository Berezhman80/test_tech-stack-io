import { expect, test } from '@playwright/test';
import { AddressSteps } from '../../steps/ui/main/addressSteps.js';
import { HomeSteps } from '../../steps/ui/main/homeSteps.js';
import { LoginSteps } from '../../steps/ui/login/loginSteps.js';
import { UserSteps } from '../../steps/ui/main/userSteps.js';
import { AddressApiSteps } from '../../steps/api/addressApiSteps.js';
import { AuthApiSteps } from '../../steps/api/authApiSteps.js';
import { UserApiSteps } from '../../steps/api/userApiSteps.js';
import AddressDto from '../../dto/address/address.dto.js';
import AddUserDTO from '../../dto/user/add.user.dto.js';
import AddressResponseDto from '../../dto/address/address.response.dto.js';
import UserRequestDto from '../../dto/user/user.request.dto.js';
import UserResponseDto from '../../dto/user/user.response.dto.js';

const SITE_TITLE = 'Trainees website';

test.describe('UI and API for Users', { tag: ['@desktop', '@mobile'] }, () => {
  let user: AddUserDTO | undefined;
  let token: string | undefined;
  let createdId: string | undefined;
  let homeSteps: HomeSteps;
  let userSteps: UserSteps;
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
    userSteps = new UserSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that a user created via API is visible in the UI', async ({ page }) => {
    homeSteps = new HomeSteps(page);
    userSteps = new UserSteps(page);

    await homeSteps.expectUsersSection();
    await userSteps.expectUserInTable(user!);
  });

  test('Check via API that a user edited in the UI has the new values', async ({
    page,
    request,
  }) => {
    userSteps = new UserSteps(page);

    const updated = new AddUserDTO();
    updated.userName = `Edit${Date.now().toString().slice(-8)}`;
    updated.yearOfBirth = '2001';
    updated.gender = 'Female';

    await userSteps.editUser(user!, updated);

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

test.describe('UI and API for Addresses', { tag: ['@desktop', '@mobile'] }, () => {
  let address: AddressDto | undefined;
  let token: string | undefined;
  let createdId: string | undefined;
  let homeSteps: HomeSteps;
  let addressSteps: AddressSteps;
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
    addressSteps = new AddressSteps(page);

    await loginSteps.openLoginPage();
    await loginSteps.loginWithValidCredentials();
    await homeSteps.expectHomePageLoaded(SITE_TITLE);
  });

  test('Check that an address created via API is visible in the UI', async ({ page }) => {
    homeSteps = new HomeSteps(page);
    addressSteps = new AddressSteps(page);

    await homeSteps.expectAddressesSection();
    await addressSteps.expectAddressInTable(address!);
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
