import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashersController } from './washers.controller';
import { WashersService } from './washers.service';
import { Washer } from './entities/washers.entity';
import { WashersRepository } from './repositories/washers.repository';
import { WASHERS_REPOSITORY_TOKEN } from './interfaces/washers-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Washer]),
  ],
  controllers: [WashersController],
  providers: [
    WashersService,
    WashersRepository,
    {
      provide: WASHERS_REPOSITORY_TOKEN,
      useClass: WashersRepository,
    },
  ],
  exports: [WashersService],
})
export class WashersModule {}
