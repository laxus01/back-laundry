import { HttpException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { TypeParking } from 'src/parkings/entities/type-parking.entity';
import { TypeVehicle } from 'src/vehicles/entities/type-vehicle.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(TypeParking) private typeParkingRepository: Repository<TypeParking>,
    @InjectRepository(TypeVehicle) private typeVehicleRepository: Repository<TypeVehicle>,
    private jwtAuthService: JwtService,
  ) {}

  async login(userObjectLogin: LoginAuthDto) {
    const { user, password } = userObjectLogin;
    
    try {
      const findUser = await this.userRepository.findOne({ where: { user } });
      
      if (!findUser) {
        this.logger.warn(`Login attempt with non-existent user: ${user}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verificar contraseña hasheada
      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for user: ${user}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`Successful login for user: ${user}`);
      
      // Fetch static application data
      const typeParkings = await this.typeParkingRepository.find();
      const typeVehicles = await this.typeVehicleRepository.find();
      
      const payload = { id: findUser.id, name: findUser.name };
      const token = this.jwtAuthService.sign(payload);
      
      const data = {
        token,
        user: {
          id: findUser.id,
          name: findUser.name,
          user: findUser.user
        },
        staticData: {
          typeParkings,
          typeVehicles,
        },
      };
      
      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login error for user ${user}: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
