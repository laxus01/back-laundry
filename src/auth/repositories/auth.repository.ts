import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TypeParking } from '../../parkings/entities/type-parking.entity';
import { TypeVehicle } from '../../vehicles/entities/type-vehicle.entity';
import { IAuthRepository } from '../interfaces/auth-manager.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TypeParking)
    private readonly typeParkingRepository: Repository<TypeParking>,
    @InjectRepository(TypeVehicle)
    private readonly typeVehicleRepository: Repository<TypeVehicle>,
  ) {}

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { user: username },
    });

    return user || null;
  }

  async getTypeParkings(): Promise<TypeParking[]> {
    return this.typeParkingRepository.find();
  }

  async getTypeVehicles(): Promise<TypeVehicle[]> {
    return this.typeVehicleRepository.find();
  }
}
