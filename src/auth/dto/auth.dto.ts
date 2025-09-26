import { IAuthResponse } from '../interfaces/auth-manager.interface';

export class AuthResponseDto implements IAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    user: string;
  };
  staticData: {
    typeParkings: any[];
    typeVehicles: any[];
  };
}

export class LoginRequestDto {
  user: string;
  password: string;
}
