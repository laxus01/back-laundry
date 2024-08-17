import { Module } from '@nestjs/common';
import { WashersController } from './washers.controller';
import { WashersService } from './washers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Washer } from 'src/entities/washers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Washer]),
  ],
  controllers: [WashersController],
  providers: [WashersService]
})
export class WashersModule {}
