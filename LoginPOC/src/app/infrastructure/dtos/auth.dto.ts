export interface LoginRequestDTO {
  readonly username: string;
  readonly password: string;
  readonly remember_me: boolean;
}

export interface LoginResponseDTO {
  readonly user: {
    readonly user_id: string;
    readonly username: string;
    readonly display_name: string;
    readonly email: string;
  };
}
