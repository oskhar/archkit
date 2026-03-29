import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesTransaction, TransactionStatus } from '../../domain/entities/sales-transaction.entity';
import { SalesItem } from '../../domain/entities/sales-item.entity';

@Injectable()
export class SalesRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SalesTransaction)
    private readonly transactionRepository: Repository<SalesTransaction>,
    @InjectRepository(SalesItem)
    private readonly itemRepository: Repository<SalesItem>,
  ) {}

  async createTransaction(totalPrice: number, items: Partial<SalesItem>[]): Promise<SalesTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = queryRunner.manager.create(SalesTransaction, {
        totalPrice,
        status: TransactionStatus.COMPLETED,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      const salesItems = items.map((item) =>
        queryRunner.manager.create(SalesItem, {
          ...item,
          transactionId: savedTransaction.id,
        }),
      );
      await queryRunner.manager.save(salesItems);

      await queryRunner.commitTransaction();
      return this.transactionRepository.findOne({
        where: { id: savedTransaction.id },
        relations: ['items'],
      }) as Promise<SalesTransaction>;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findTransactionById(id: string): Promise<SalesTransaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}
