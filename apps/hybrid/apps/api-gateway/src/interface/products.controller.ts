import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  private readonly productServiceUrl = 'http://localhost:3001/products';

  @Post()
  async create(@Body() body: any) {
    const response = await fetch(this.productServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get()
  async findAll() {
    const response = await fetch(this.productServiceUrl);
    return response.json();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await fetch(`${this.productServiceUrl}/${id}`);
    return response.json();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const response = await fetch(`${this.productServiceUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await fetch(`${this.productServiceUrl}/${id}`, {
      method: 'DELETE',
    });
  }
}
