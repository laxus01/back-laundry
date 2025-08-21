import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParkingsService } from './parkings/parkings.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const monthlyTaskService = app.get(ParkingsService);
  monthlyTaskService.setupMonthlyCron();
  app.enableCors(); 
  const port = parseInt(process.env.PORT as string, 10) || 3000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}
bootstrap();