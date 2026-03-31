import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../application/commands/create-product.handler';
import { GetProductsQuery } from '../../application/queries/get-products.handler';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() body: any) {
    return this.commandBus.execute(
      new CreateProductCommand(body.name, body.price, body.category, body.description),
    );
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new GetProductsQuery());
  }
}
