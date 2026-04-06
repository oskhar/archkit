import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './interface/health.controller';
import { DiagnosticsController } from './interface/diagnostics.controller';
import { ProductsController } from './interface/products.controller';
import { InventoryController } from './interface/inventory.controller';
import { SalesController } from './interface/sales.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    HttpModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          consumer: {
            groupId: 'gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [
    HealthController,
    DiagnosticsController,
    ProductsController,
    InventoryController,
    SalesController,
  ],
  providers: [],
})
export class AppModule {}
