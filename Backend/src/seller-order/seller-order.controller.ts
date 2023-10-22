import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  ValidationPipe,
  Get,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import { SellerAuthGuard } from 'src/auth/guards/seller-auth.guard';
import {
  SellerOrderDto,
  deleteOrderItemsDto,
  updateOrderItemsDto,
  updateOrderStatusDto,
} from './dto/create-seller-order.dto';
import { SellerOrderService } from './seller-order.service';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Seller-Order Api')
@Controller('seller-order')
export class SellerOrderController {
  constructor(private readonly sellerOrderService: SellerOrderService) {}
  @Post('/add')
  @ApiOperation({ summary: 'Create Seller Order Route' })
  @UseGuards(SellerAuthGuard)
  async createSellerDocument(
    @Body(ValidationPipe) body: SellerOrderDto,
    @Res() res: Response,
  ) {
    return this.sellerOrderService.createSellerOrder(body, res);
  }

  @Get('/allOrder')
  @ApiOperation({ summary: 'Get All Order Route' })
  @UseGuards(SellerAuthGuard)
  async getAllOrders(@Res() res: Response) {
    return this.sellerOrderService.getAllOrders(res);
  }
  @Get('/:id')
  @ApiOperation({ summary: ' Get All Single Order By Id Route' })
  @UseGuards(SellerAuthGuard)
  async getSellerOrderById(@Param('id') id: string, @Res() res: Response) {
    return this.sellerOrderService.getSellerOrderById(id, res);
  }

  @Get('/bySeller/:id')
  @ApiOperation({ summary: 'Get All Seller  Route' })
  @UseGuards(SellerAuthGuard)
  async getAllOrdersBySellerId(@Param('id') id: string, @Res() res: Response) {
    return this.sellerOrderService.getAllSellerOrdersBySellerId(id, res);
  }

  // admin section
  // get all orders
  @Get('/admin/orders')
  @ApiOperation({ summary: 'Get All Order By Admin Route' })
  @UseGuards(AdminAuthGuard)
  async getAllSellerOrders(@Res() res: Response) {
    return this.sellerOrderService.getAllSellerOrders(res);
  }

  // get single order by orderId
  @Get('/admin/:id')
  @ApiOperation({ summary: 'Get Single Seller Order By Admin Route' })
  @UseGuards(AdminAuthGuard)
  async getSellerOrderByIdAdmin(@Param('id') id: string, @Res() res: Response) {
    return this.sellerOrderService.getSellerOrderById(id, res);
  }

  // update order status
  @Put('/admin/status/:orderId')
  @ApiOperation({ summary: 'Update Order Status By Admin Route' })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateStatus: updateOrderStatusDto,
    @Res() res,
  ) {
    return this.sellerOrderService.updateOrderStatus(
      orderId,
      res,
      updateStatus,
    );
  }

  // get all order by sellerId
  @Get('/admin/orders/:sellerId')
  @ApiOperation({ summary: 'Get All Order By Seller Id' })
  async getAllOrderofSeller(@Param('sellerId') sellerId: string, @Res() res) {
    return this.sellerOrderService.getAllOrderofSeller(sellerId, res);
  }

  @Put('/admin/updateOrderItems/:orderId')
  @ApiOperation({ summary: 'Update Single Address By AddressId Route' })
  // @UseGuards(AdminAuthGuard)
  async updateOrderItems(
    @Param('orderId') orderId: string,
    @Res() res: Response,
    @Body() updateOrderItems: updateOrderItemsDto,
  ) {
    return this.sellerOrderService.updateOrderItems(
      orderId,
      res,
      updateOrderItems,
    );
  }

  @Delete('/admin/deleteOrder/:orderId')
  @ApiOperation({ summary: 'Delete Seller-Order By OrderId Route' })
  async deleteOrder(@Param('orderId') orderId: string, @Res() res: Response) {
    return this.sellerOrderService.deleteOrder(orderId, res);
  }

  @Put('/admin/deleteOrderItems/:orderId')
  @ApiOperation({ summary: 'Delete Some Order Item By Admin Route' })
  async deleteOrderItem(
    @Param('orderId') orderId: string,
    @Res() res: Response,
    @Body() deleteOrderItems: deleteOrderItemsDto,
  ) {
    return this.sellerOrderService.deleteOrderItem(
      orderId,
      res,
      deleteOrderItems,
    );
  }
}
