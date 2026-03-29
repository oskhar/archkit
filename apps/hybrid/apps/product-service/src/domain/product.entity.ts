import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;
}
