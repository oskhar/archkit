import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';

export class AdjustStockCommand {
  constructor(
    public readonly productId: string,
    public readonly delta: number,
  ) {}
}

@CommandHandler(AdjustStockCommand)
export class AdjustStockHandler implements ICommandHandler<AdjustStockCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(command: AdjustStockCommand) {
    const { productId, delta } = command;
    const inventory = await this.repository.adjustStock(productId, delta);
    
    this.kafkaClient.emit('inventory.updated', JSON.stringify({
      productId: inventory.productId,
      newQuantity: inventory.quantity,
      delta,
      timestamp: new Date().toISOString(),
    }));
    
    return inventory;
  }
}
