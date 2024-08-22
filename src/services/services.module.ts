import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from 'src/entities/services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
