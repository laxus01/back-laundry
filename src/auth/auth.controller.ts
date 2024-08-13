import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    //@UseGuards(JwtAuthGuard)
    @Post('login')
    loginUser(@Body() userObjectLogin: LoginAuthDto){    
      console.log(userObjectLogin)
      return this.authService.login(userObjectLogin);
    }
}
