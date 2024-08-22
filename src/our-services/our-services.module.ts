import { Module } from '@nestjs/common';
import { OurServicesController } from './our-services.controller';
import { OurServicesService } from './our-services.service';
import { OurService } from 'src/entities/our-services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OurService]),
  ],
  controllers: [OurServicesController],
  providers: [OurServicesService]
})
export class OurServicesModule {}
