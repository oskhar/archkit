import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCache } from '../../domain/entities/product-cache.entity';

@Controller()
export class ProductEventConsumer {
  private readonly logger = new Logger(ProductEventConsumer.name);

  constructor(
    @InjectRepository(ProductCache)
    private readonly productCacheRepository: Repository<ProductCache>,
  ) {}

  @MessagePattern('product.created')
  async handleProductCreated(@Payload() data: any) {
    this.logger.log(`Received product.created event: ${JSON.stringify(data)}`);
    const product = typeof data === 'string' ? JSON.parse(data) : data;
    await this.productCacheRepository.save({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  }

  @MessagePattern('product.updated')
  async handleProductUpdated(@Payload() data: any) {
    this.logger.log(`Received product.updated event: ${JSON.stringify(data)}`);
    const product = typeof data === 'string' ? JSON.parse(data) : data;
    await this.productCacheRepository.save({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  }

  @MessagePattern('product.deleted')
  async handleProductDeleted(@Payload() data: any) {
    this.logger.log(`Received product.deleted event: ${JSON.stringify(data)}`);
    const event = typeof data === 'string' ? JSON.parse(data) : data;
    const productId = event.id;
    if (productId) {
      await this.productCacheRepository.delete(productId);
      this.logger.log(`Removed product ${productId} from cache`);
    }
  }
}
