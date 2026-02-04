import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaulterWashersController } from './defaulter-washers.controller';
import { DefaulterWashersService } from './defaulter-washers.service';
import { DefaulterWasher } from './entities/defaulter-washers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefaulterWasher])],
  controllers: [DefaulterWashersController],
  providers: [DefaulterWashersService],
  exports: [DefaulterWashersService],
})
export class DefaulterWashersModule {}
