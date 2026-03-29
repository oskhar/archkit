import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/product/commands/create-product.handler';
import { UpdateProductCommand } from '../application/product/commands/update-product.handler';
import { DeleteProductCommand } from '../application/product/commands/delete-product.handler';
import { GetProductByIdQuery } from '../application/product/queries/get-product-by-id.handler';
import { GetAllProductsQuery } from '../application/product/queries/get-all-products.handler';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateProductDto,
  UpdateProductDto,
} from '../domain/product.schema';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() body: CreateProductDto) {
    this.logger.log(`Creating product: ${body.name}`);
    return this.commandBus.execute(new CreateProductCommand(body.name, body.price));
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all products');
    return this.queryBus.execute(new GetAllProductsQuery());
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching product: ${id}`);
    return this.queryBus.execute(new GetProductByIdQuery(id));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProductDto,
  ) {
    this.logger.log(`Updating product: ${id}`);
    return this.commandBus.execute(new UpdateProductCommand(id, body.name, body.price));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Deleting product: ${id}`);
    return this.commandBus.execute(new DeleteProductCommand(id));
  }
}
