import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';

@Controller('sales')
export class SalesController {
  private readonly salesServiceUrl = 'http://localhost:3003/sales';

  @Post('transaction')
  async create(@Body() body: any) {
    const response = await fetch(`${this.salesServiceUrl}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  @Get('transactions/:id')
  async findOne(@Param('id') id: string) {
    const response = await fetch(`${this.salesServiceUrl}/transactions/${id}`);
    return response.json();
  }
}
