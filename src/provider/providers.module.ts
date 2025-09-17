import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from 'src/provider/entities/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
  ],
  providers: [ProvidersService],
  controllers: [ProvidersController]
})
export class ProvidersModule {}
