import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PricesHistoryService } from './prices-history.service';
import { CreatePricesHistoryDto } from './dto/create-prices-history.dto';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import { Response } from 'express';

@ApiTags('Price History Api')
@Controller('prices-history/admin')
export class PricesHistoryController {
  constructor(private readonly pricesHistoryService: PricesHistoryService) {}

  @Post('createHistory')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create Price History Route' })
  @ApiBody({
    type: CreatePricesHistoryDto,
  })
  createPricesHistory(
    @Body(ValidationPipe) createPricesHistoryDto: CreatePricesHistoryDto[],
    @Res() res: Response,
  ) {
    return this.pricesHistoryService.createPriceHistory(
      createPricesHistoryDto,
      res,
    );
  }

  @Get('getHistory/:sku')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get Single PriceHistory' })
  getOnePriceHistory(@Param('sku') sku: string, @Res() res) {
    return this.pricesHistoryService.getOnePriceHistory(sku, res);
  }

  @Get('getAllHistory')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Price History Route' })
  getAllPriceHistory(@Res() res) {
    return this.pricesHistoryService.getAllPriceHistory(res);
  }
}
