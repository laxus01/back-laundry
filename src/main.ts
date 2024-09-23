import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParkingsService } from './parkings/parkings.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const monthlyTaskService = app.get(ParkingsService);
  monthlyTaskService.setupMonthlyCron();
  app.enableCors(); 
  await app.listen(3000);
}
bootstrap();