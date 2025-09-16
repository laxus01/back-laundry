import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { TypeParking } from 'src/parkings/entities/type-parking.entity';
import { TypeVehicle } from 'src/vehicles/entities/type-vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(TypeParking) private typeParkingRepository: Repository<TypeParking>,
    @InjectRepository(TypeVehicle) private typeVehicleRepository: Repository<TypeVehicle>,
    private jwtAuthService: JwtService,
  ) {}

  async login(userObjectLogin: LoginAuthDto) {
    const { user, password } = userObjectLogin;
    const findUser = await this.userRepository.findOne({ where: { user } });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    if (password !== findUser.password)
      throw new HttpException('PASSWORD_INVALID', 403);
    
    // Fetch static application data
    const typeParkings = await this.typeParkingRepository.find();
    const typeVehicles = await this.typeVehicleRepository.find();
    
    const payload = { id: findUser.id, name: findUser.name };
    const token = this.jwtAuthService.sign(payload);
    const data = {
      token,
      staticData: {
        typeParkings,
        typeVehicles,
      },
    };
    return data;
  }
}
