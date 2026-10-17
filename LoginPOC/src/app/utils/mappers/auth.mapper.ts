import { LoginCredentials, User } from '../../domain/models/auth.model';
import { LoginRequestDTO, LoginResponseDTO } from '../../infrastructure/dtos/auth.dto';

export function toLoginRequestDTO(credentials: LoginCredentials): LoginRequestDTO {
  return {
    username: credentials.username,
    password: credentials.password,
    remember_me: credentials.rememberMe,
  };
}

export function toUser(response: LoginResponseDTO): User {
  return {
    id: response.user.user_id,
    username: response.user.username,
    displayName: response.user.display_name,
    email: response.user.email,
  };
}
