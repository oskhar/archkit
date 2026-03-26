import { Module } from '@nestjs/common';
import { HealthController } from './interface/health.controller';
import { ConnectivityController } from './interface/connectivity.controller';

@Module({
  imports: [],
  controllers: [HealthController, ConnectivityController],
  providers: [],
})
export class AppModule {}
