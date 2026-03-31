import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SalesRepository } from '../../infrastructure/repositories/sales.repository';

export class GetSaleQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetSaleQuery)
export class GetSaleHandler implements IQueryHandler<GetSaleQuery> {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute(query: GetSaleQuery) {
    return this.salesRepository.findTransactionById(query.id);
  }
}
