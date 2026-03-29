import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';

@Controller('inventory')
export class InventoryController {
  private readonly inventoryServiceUrl = 'http://localhost:3002/inventory';

  @Post('adjust')
  async adjust(@Body() body: any) {
    const response = await fetch(`${this.inventoryServiceUrl}/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    const response = await fetch(`${this.inventoryServiceUrl}/${productId}`);
    return response.json();
  }
}
