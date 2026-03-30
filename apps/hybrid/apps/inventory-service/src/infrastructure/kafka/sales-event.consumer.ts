import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryRepository } from '../repositories/inventory.repository';

@Controller()
export class SalesEventConsumer {
  private readonly logger = new Logger(SalesEventConsumer.name);

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  @MessagePattern('sales.transaction-completed')
  async handleSaleCompleted(@Payload() data: any) {
    this.logger.log(`Received sales.transaction-completed event: ${JSON.stringify(data)}`);
    const event = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (event.items && Array.isArray(event.items)) {
      for (const item of event.items) {
        await this.inventoryRepository.adjustStock(item.productId, -item.quantity);
        this.logger.log(`Reduced stock for product ${item.productId} by ${item.quantity}`);
      }
    }
  }
}
