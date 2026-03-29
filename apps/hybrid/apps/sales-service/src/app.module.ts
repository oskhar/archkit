import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './interface/health.controller';

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
        port: configService.get<number>('DB_PORT', 3309),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_sales'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // For experiment purposes
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
