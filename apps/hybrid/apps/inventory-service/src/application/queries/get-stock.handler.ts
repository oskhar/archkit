import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';

export class GetStockQuery {
  constructor(public readonly productId: string) {}
}

@QueryHandler(GetStockQuery)
export class GetStockHandler implements IQueryHandler<GetStockQuery> {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(query: GetStockQuery) {
    const { productId } = query;
    const inventory = await this.repository.findByProductId(productId);
    
    if (!inventory) {
      return { productId, quantity: 0 };
    }
    
    return inventory;
  }
}
