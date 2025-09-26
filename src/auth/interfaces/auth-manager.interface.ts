import { User } from '../../users/entities/user.entity';
import { TypeParking } from '../../parkings/entities/type-parking.entity';
import { TypeVehicle } from '../../vehicles/entities/type-vehicle.entity';

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    user: string;
  };
  staticData: {
    typeParkings: TypeParking[];
    typeVehicles: TypeVehicle[];
  };
}

export interface IAuthRepository {
  findUserByUsername(username: string): Promise<User | null>;
  getTypeParkings(): Promise<TypeParking[]>;
  getTypeVehicles(): Promise<TypeVehicle[]>;
}

export const AUTH_REPOSITORY_TOKEN = 'AUTH_REPOSITORY';
