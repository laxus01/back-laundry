import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvancesController } from './advances.controller';
import { AdvancesService } from './advances.service';
import { Advance } from './entities/advances.entity';
import { AdvancesRepository } from './repositories/advances.repository';
import { ADVANCES_REPOSITORY_TOKEN } from './interfaces/advances-manager.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Advance])],
  controllers: [AdvancesController],
  providers: [
    AdvancesService,
    {
      provide: ADVANCES_REPOSITORY_TOKEN,
      useClass: AdvancesRepository,
    },
  ],
  exports: [AdvancesService, ADVANCES_REPOSITORY_TOKEN],
})
export class AdvancesModule {}
