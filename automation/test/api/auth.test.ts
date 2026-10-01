import { expect, test } from '@playwright/test';
import { AuthApiSteps } from '../../steps/api/authApiSteps.js';
import AuthResponseDto from '../../dto/auth/auth.response.dto.js';

test.describe('Auth API', { tag: '@api' }, () => {
  let authApiSteps: AuthApiSteps;

  test.beforeEach(async ({ request }) => {
    authApiSteps = new AuthApiSteps(request);
  });

  test('Check that login with valid credentials returns a token', async () => {
    const response = await authApiSteps.loginWithValidCredentials();

    expect(response.status()).toBe(200);

    const body = (await response.json()) as AuthResponseDto;

    expect(body).toMatchObject({
      tokenType: 'Bearer',
    });
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.accessToken.length).toBeGreaterThan(0);
  });
});
