import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';

@Module({
  imports: [RestauranteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
