import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductProducer implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('product.created');
    await this.kafkaClient.connect();
  }

  async emitProductCreated(product: Product) {
    this.kafkaClient.emit('product.created', JSON.stringify(product));
  }
}
