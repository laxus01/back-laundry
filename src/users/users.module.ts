import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY_TOKEN } from './interfaces/users-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
