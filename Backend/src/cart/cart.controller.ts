import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Res,
  Req,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { SellerAuthGuard } from 'src/auth/guards/seller-auth.guard';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Seller Cart Api")
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addCart')
  @ApiOperation({ summary: 'Add Cart Route' })
  @ApiBody({
    type:CreateCartDto
  })
  @UseGuards(SellerAuthGuard)
  createCart(
    @Body(ValidationPipe) createCartDto: CreateCartDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.cartService.createCart(createCartDto, res, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'To Get Single Carts Item Route' })
  @UseGuards(SellerAuthGuard)
  getCart(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    return this.cartService.getCart(id, res, req);
  }

  @Put('/updateCartQty/:id')
  @ApiOperation({ summary: 'To Update Single Cart Route' })
  @UseGuards(SellerAuthGuard)
  updateQty(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.cartService.updateQtyCart(id, res, req);
  }

  @Delete('/deleteCartItem/:id')
  @ApiOperation({ summary: 'To Delete Single Cart Route' })
  @UseGuards(SellerAuthGuard)
  deleteCartItem(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() sku?: any ,
  ) {
    return this.cartService.deleteCartItem(id, res,sku);
  }
}
