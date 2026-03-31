import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProductCache } from '../../domain/entities/product-cache.entity';
import { SalesRepository } from '../../infrastructure/repositories/sales.repository';

export class CreateSaleCommand {
  constructor(
    public readonly items: { productId: string; quantity: number }[],
  ) {}
}

@CommandHandler(CreateSaleCommand)
export class CreateSaleHandler implements ICommandHandler<CreateSaleCommand>, OnModuleInit {
  constructor(
    @InjectRepository(ProductCache)
    private readonly productCacheRepository: Repository<ProductCache>,
    private readonly salesRepository: SalesRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('sales.transaction-completed');
    await this.kafkaClient.connect();
  }

  async execute(command: CreateSaleCommand) {
    const { items: requestItems } = command;
    let totalTransactionPrice = 0;
    const itemsToSave = [];

    for (const item of requestItems) {
      const product = await this.productCacheRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found in cache`);
      }

      const unitPrice = Number(product.price);
      totalTransactionPrice += unitPrice * item.quantity;

      itemsToSave.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      });
    }

    const transaction = await this.salesRepository.createTransaction(
      totalTransactionPrice,
      itemsToSave,
    );

    // Emit SaleCompleted event
    this.kafkaClient.emit('sales.transaction-completed', JSON.stringify({
      transactionId: transaction.id,
      items: transaction.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      timestamp: new Date().toISOString(),
    }));

    return transaction;
  }
}
