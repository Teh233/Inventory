import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  Put,
} from '@nestjs/common';
import { DiscountQueriesService } from './discount-queries.service';
import {
  CreateDiscountQueryDto,
  UpdateDiscountQueryDto,
} from './dto/create-discount-query.dto';
import { Response } from 'express';
import {  ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("DiscountQuery Api")
@Controller('discount-queries')
export class DiscountQueriesController {
  constructor(
    private readonly discountQueriesService: DiscountQueriesService,
  ) {}

  @Post('/addDiscountQuery')
  @ApiOperation({ summary: 'Create Discount Query Route' })
  @ApiBody({
    type:CreateDiscountQueryDto
  })
  create(
    @Body() createDiscountQueryDto: CreateDiscountQueryDto,
    @Res() res: Response,
  ) {
    return this.discountQueriesService.addDiscountQuery(
      createDiscountQueryDto,
      res,
    );
  }

  @Get('/getDiscountQuery')
  @ApiOperation({ summary: 'To Get All Discount Query Route' })
  getDiscountQuery(@Res() res: Response) {
    return this.discountQueriesService.getDisountQuery(res);
  }

  @Get('/getDiscountQuery/:QueryId')
  @ApiOperation({ summary: 'To Get Single Discount Query Route' })
  getSingleDiscountQuery(
    @Param('QueryId') QueryId: string,
    @Query('type') type: string,
    @Res() res: Response,
  ) {
    return this.discountQueriesService.getSingleDiscountQuery(
      QueryId,
      type,
      res,
    );
  }

  @Put('/updateDiscountQuery/:QueryId')
  @ApiOperation({ summary: 'To Update Single Discount Query Route' })
  updateDiscountQuery(
    @Param('QueryId') QueryId: string,
    @Query('type') type: string,
    @Body() UpdateDiscountQueryDto: UpdateDiscountQueryDto,
    @Res() res: Response,
  ) {
    return this.discountQueriesService.updateDiscountQuery(
      QueryId,
      type,
      UpdateDiscountQueryDto,
      res,
    );
  }
}
