import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtAuthService: JwtService,
  ) {}

  async login(userObjectLogin: LoginAuthDto) {
    const { user, password } = userObjectLogin;
    console.log(user, password);
    const findUser = await this.userRepository.findOne({ where: { user } });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    if (password !== findUser.password)
      throw new HttpException('PASSWORD_INVALID', 403);
    const payload = { id: findUser.id, name: findUser.name };
    const token = this.jwtAuthService.sign(payload);
    const data = {
      user: findUser,
      token,
    };
    return data;
  }
}
