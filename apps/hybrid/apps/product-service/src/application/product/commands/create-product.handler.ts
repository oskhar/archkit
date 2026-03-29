import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from '../../../domain/product.entity';

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
  ) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, price } = command;
    const product = this.productRepository.create({ name, price });
    const savedProduct = await this.productRepository.save(product);

    this.kafkaClient.emit('product.created', JSON.stringify(savedProduct));

    return savedProduct;
  }
}
