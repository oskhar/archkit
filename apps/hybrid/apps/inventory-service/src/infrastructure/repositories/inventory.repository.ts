import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../../domain/entities/inventory.entity';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(Inventory)
    private readonly repository: Repository<Inventory>,
  ) {}

  async findByProductId(productId: string): Promise<Inventory | null> {
    return this.repository.findOne({ where: { productId } });
  }

  async adjustStock(productId: string, delta: number): Promise<Inventory> {
    let inventory = await this.findByProductId(productId);

    if (!inventory) {
      inventory = this.repository.create({
        productId,
        quantity: delta,
      });
    } else {
      inventory.quantity += delta;
    }

    return this.repository.save(inventory);
  }

  async save(inventory: Inventory): Promise<Inventory> {
    return this.repository.save(inventory);
  }

  async create(productId: string): Promise<Inventory> {
    const inventory = this.repository.create({
      productId,
      quantity: 0,
    });
    return this.repository.save(inventory);
  }
}
