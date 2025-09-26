import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/clients.entity';
import { ClientsRepository } from './repositories/clients.repository';
import { CLIENTS_REPOSITORY_TOKEN } from './interfaces/clients-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    {
      provide: CLIENTS_REPOSITORY_TOKEN,
      useClass: ClientsRepository,
    },
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
