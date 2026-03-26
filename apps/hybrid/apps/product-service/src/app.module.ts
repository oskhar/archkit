import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './interface/health.controller';
import { PingController } from './interface/ping.controller';
import { PingHandler } from './application/ping/ping.handler';

@Module({
  imports: [CqrsModule],
  controllers: [HealthController, PingController],
  providers: [PingHandler],
})
export class AppModule {}
