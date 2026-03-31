import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { Product } from './domain/entities/product.entity';
import { CreateProductHandler } from './application/commands/create-product.handler';
import { GetProductsHandler } from './application/queries/get-products.handler';
import { HealthController } from './interface/health.controller';
import { ProductController } from './interface/controllers/product.controller';
import { ProductProducer } from './infrastructure/kafka/product.producer';

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
        synchronize: true,
        extra: {
          connectionLimit: 10,
        },
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [HealthController, ProductController],
  providers: [CreateProductHandler, GetProductsHandler, ProductProducer],
})
export class AppModule {}
