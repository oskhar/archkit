import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../domain/product.entity';

export class GetAllProductsQuery {}

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(_query: GetAllProductsQuery): Promise<Product[]> {
    return this.productRepository.find();
  }
}
