export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface User {
  readonly id: string;
  readonly username: string;
  readonly displayName: string;
  readonly email: string;
}
