import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './interface/health.controller';
import { ConnectivityController } from './interface/connectivity.controller';
import { Inventory } from './domain/entities/inventory.entity';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { InventoryController } from './interface/controllers/inventory.controller';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { AdjustStockHandler } from './application/commands/adjust-stock.handler';
import { GetStockHandler } from './application/queries/get-stock.handler';
import { ProductEventConsumer } from './infrastructure/kafka/product-event.consumer';

const Handlers = [AdjustStockHandler, GetStockHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3308),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_inventory'),
        entities: [Inventory],
        synchronize: true, // For experiment purposes
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Inventory]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [
    HealthController,
    ConnectivityController,
    InventoryController,
    ProductEventConsumer,
  ],
  providers: [InventoryRepository, ...Handlers],
})
export class AppModule {}
