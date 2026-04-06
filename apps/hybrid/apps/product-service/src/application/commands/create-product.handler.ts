import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductProducer } from '../../infrastructure/kafka/product.producer';

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public readonly description?: string,
  ) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productProducer: ProductProducer,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, price, category, description } = command;
    const product = this.productRepository.create({ name, price, category, description });
    const savedProduct = await this.productRepository.save(product);

    await this.productProducer.emitProductCreated(savedProduct);

    return savedProduct;
  }
}
