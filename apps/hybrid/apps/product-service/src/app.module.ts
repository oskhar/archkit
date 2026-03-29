import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './infrastructure/kafka.module';
import { Product } from './domain/product.entity';
import { CreateProductHandler } from './application/product/commands/create-product.handler';
import { UpdateProductHandler } from './application/product/commands/update-product.handler';
import { DeleteProductHandler } from './application/product/commands/delete-product.handler';
import { GetProductByIdHandler } from './application/product/queries/get-product-by-id.handler';
import { GetAllProductsHandler } from './application/product/queries/get-all-products.handler';
import { HealthController } from './interface/health.controller';
import { ProductController } from './interface/product.controller';
import { PingController } from './interface/ping.controller';
import { PingHandler } from './application/ping/ping.handler';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];
const QueryHandlers = [GetProductByIdHandler, GetAllProductsHandler];

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
        port: configService.get<number>('DB_PORT', 3307),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_product'),
        entities: [Product],
        synchronize: true, // For experiment purposes
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [HealthController, ProductController, PingController],
  providers: [...CommandHandlers, ...QueryHandlers, PingHandler],
})
export class AppModule {}
