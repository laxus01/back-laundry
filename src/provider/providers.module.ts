import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from './entities/provider.entity';
import { ProvidersRepository } from './repositories/providers.repository';
import { PROVIDERS_REPOSITORY_TOKEN } from './interfaces/providers-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
  ],
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    ProvidersRepository,
    {
      provide: PROVIDERS_REPOSITORY_TOKEN,
      useClass: ProvidersRepository,
    },
  ],
  exports: [ProvidersService],
})
export class ProvidersModule {}
