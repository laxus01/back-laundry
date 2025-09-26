import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/services.entity';
import { ServicesRepository } from './repositories/services.repository';
import { SERVICES_REPOSITORY_TOKEN } from './interfaces/services-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    ServicesRepository,
    {
      provide: SERVICES_REPOSITORY_TOKEN,
      useClass: ServicesRepository,
    },
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
