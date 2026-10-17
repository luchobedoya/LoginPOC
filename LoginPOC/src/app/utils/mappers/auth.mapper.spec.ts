import { toLoginRequestDTO, toUser } from './auth.mapper';

describe('auth mappers', () => {
  for (const rememberMe of [true, false]) {
    it(`should map credentials to a request DTO with rememberMe=${rememberMe}`, () => {
      const credentials = Object.freeze({
        username: 'demo',
        password: 'Login123!',
        rememberMe,
      });

      expect(toLoginRequestDTO(credentials)).toEqual({
        username: 'demo',
        password: 'Login123!',
        remember_me: rememberMe,
      });
    });
  }

  it('should map backend fields to a new domain user without mutating the response', () => {
    const response = Object.freeze({
      user: Object.freeze({
        user_id: 'user-42',
        username: 'luis',
        display_name: 'Luis Bedoya',
        email: 'luis@example.com',
      }),
    });

    const user = toUser(response);

    expect(user).toEqual({
      id: 'user-42',
      username: 'luis',
      displayName: 'Luis Bedoya',
      email: 'luis@example.com',
    });
    expect(Object.is(user, response.user)).toBeFalse();
  });
});
