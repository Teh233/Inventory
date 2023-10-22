import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller } from 'src/auth/schema/users.schema';
import { WebsocketEventsService } from 'src/websocket-events/websocket-events.service';
import { roboproducts } from '../robo-products/schema/robo-products.schema';
import {
  SellerOrderDto,
  deleteOrderItemsDto,
  updateOrderStatusDto,
} from './dto/create-seller-order.dto';
import { SellerOrder } from './schema/seller-order.schema';
import { Response } from 'express';
import { generateRandomNumber } from 'src/common/utils/common.utils';
import { Cart } from 'src/cart/schema/cart.schema';
import { SellerDocument } from 'src/seller-document/schema/seller-document.schema';
import { BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/notification/firebase.service';
@Injectable()
export class SellerOrderService {
  constructor(
    @InjectModel(Seller.name)
    private SellerModel: Model<Seller>,
    @InjectModel(SellerOrder.name)
    private SellerOrderModel: Model<SellerOrder>,
    @InjectModel(Cart.name)
    private CartModel: Model<Cart>,
    @InjectModel(SellerDocument.name)
    private SellerDocumentModel: Model<SellerDocument>,
    @InjectModel(roboproducts.name)
    private roboProductsModel: Model<roboproducts>,
    private readonly firebaseService: FirebaseService,
    private readonly websocketEvent: WebsocketEventsService,
  ) {}

  // create order
  async createSellerOrder(body: SellerOrderDto, res: Response) {
    try {
      const {
        sellerId,
        subTotalSalesAmount,
        subTotalSellerAmount,
        orderItems,
        shipAddress,
        billAddress,
      } = body;

      const seller = await this.SellerModel.findOne({ sellerId });
      if (!seller) {
        res.status(401).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }

      const orderId = `ORD${generateRandomNumber(6)}`;
      const newOrder = await this.SellerOrderModel.create({
        sellerId,
        subTotalSellerAmount,
        subTotalSalesAmount,
        orderItems,
        orderId,
        shipAddress,
        billAddress,
      });

      if (!newOrder) {
        res.status(401).send({
          status: 'error',
          message: 'Error occured during creation',
        });
        return;
      }

      const updateCart = await this.CartModel.findOneAndUpdate(
        { sellerId },
        { $set: { cartProducts: [] } },
      );
      // const adminId = 'AID3317';
      // const title = 'New Order Update';
      // const bodys = `${seller.name.charAt(0).toUpperCase()}${seller.name.slice(
      //   1,
      // )} has placed an order.`;
      // const url = 'http://localhost:5000/Cart';

      // await this.firebaseService.sendNotificationToAdmin(
      //   adminId,
      //   title,
      //   bodys,
      //   url,
      // );
      const eventData = {
        message: `WholeSale Customer ${seller.name} Created Order with Order ID ${orderId}`,
        time: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      this.websocketEvent.emitToAll('WholeSaleSeller', eventData);
      res.status(200).send({
        status: 'success',
        message: `order created with orderId ${orderId}`,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Get all orders by sellerId
  async getAllSellerOrdersBySellerId(sellerId: string, res: Response) {
    try {
      const orders = await this.SellerOrderModel.find({ sellerId }).sort({
        createdAt: -1,
      });

      res.status(200).send({
        status: 'success',
        total: orders.length,
        data: orders,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Get order by orderId
  async getSellerOrderById(orderId: string, res: Response) {
    try {
      const order = await this.SellerOrderModel.findOne({ orderId });

      if (!order) {
        res.status(404).send({
          status: 'error',
          message: 'Order not found',
        });
        return;
      }
      const sellerId = order.sellerId;
      const seller = await this.SellerDocumentModel.findOne({ sellerId });
      const orderObject = order.toObject();
      const newOrderItems = await Promise.all(
        orderObject.orderItems.map(async (item: any) => {
          const product = await this.roboProductsModel.findOne({
            SKU: item.SKU,
          });
          const landingCost = product?.LandingCost || 0;
          const GST = product?.GST || 0;
          const Stock = product?.Quantity || 0;
          return { ...item, landingCost, GST, Stock };
        }),
      );
      const orderDetails = {
        ...orderObject,
        orderItems: newOrderItems,
        concerPerson: seller?.concernPerson,
        mobileNo: seller?.mobileNo,
      };

      res.status(200).send({
        status: 'success',
        data: orderDetails,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Get all orders by sellerId
  async getAllOrders(res: Response) {
    try {
      const orders = await this.SellerOrderModel.find().sort({ createdAt: -1 });

      if (orders.length === 0) {
        res.status(404).send({
          status: 'error',
          message: 'No orders found ',
        });
        return;
      }

      res.status(200).send({
        status: 'success',
        total: orders.length,
        data: orders,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // admin section start here
  // get all orders with concernPerson and mobileNo
  async getAllSellerOrders(res) {
    try {
      const orders = await this.SellerOrderModel.find().sort({ createdAt: -1 });
      const sellerIds = orders.map((order) => order.sellerId);
      const sellers = await this.SellerDocumentModel.find({
        sellerId: { $in: sellerIds },
      });
      // console.log(sellerIds)
      const orderDetails = orders.map((order) => {
        const seller = sellers.find(
          (seller) => seller.sellerId === order.sellerId,
        );
        return {
          ...order.toObject(),
          concernPerson: seller ? seller.concernPerson : '',
          mobileNo: seller ? seller.mobileNo : '',
        };
      });
      res.status(200).send({
        status: 'success',
        message: 'Successfully retrieved seller orders with seller details',
        data: orderDetails,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // update order status
  async updateOrderStatus(orderId, res, updateStatus) {
    try {
      const { status } = updateStatus;
      const order = await this.SellerOrderModel.findOneAndUpdate(
        { orderId: orderId },
        { $set: { status: status } },
        { new: true },
      );
      if (!order) {
        res.status(404).send({ status: 'error', message: 'order not found ' });
        return;
      }
      res.status(201).send({
        status: 'success',
        message: 'status updated successfully',
        order: order,
      });
    } catch (error) {
      res.status(501).send({ status: 'error', message: error.message });
    }
  }

  // get all order by sellerId
  async getAllOrderofSeller(sellerId, res) {
    try {
      const orders = await this.SellerOrderModel.find({
        sellerId: sellerId,
      }).sort({ createdAt: -1 });
      res
        .status(200)
        .send({ status: 'success', message: 'All orders', data: orders });
    } catch (error) {
      res.status(501).send({ status: 'error', message: error.message });
    }
  }


  async updateOrderItems(orderId, res, updateOrderItems) {
    try {
      
      const { orderItems, updatedPrice } = updateOrderItems;
      if (!orderId) {
        throw new BadRequestException('OrderId is required');
      }
      const order: any = await this.SellerOrderModel.findOne({
        orderId: orderId,
      });
    
      if (orderItems && order.orderItems) {
        for (const items of orderItems) {
          if (items) { // Check if items is not null
            const { sku, qty, date } = items;
            const orderItmeIndex = order.orderItems.findIndex(
              (elem: any) => elem.SKU === sku,
            );
            if (orderItmeIndex !== -1) {
              const orderHistory = {
                SKU: sku,
                quantity: order.orderItems[orderItmeIndex].quantity,
                newQuantity: qty,
                Date: date,
                sellerPrice: null,
                newSellerPrice: null,
              };
              order.orderHistory.push(orderHistory);
              order.orderItems[orderItmeIndex].quantity = qty;
            } else {
              throw new Error(`SKU ${sku} not found in orderItems`);
            }
          }
        }
      }
  
      if (updatedPrice && order.orderItems) {
        for (const items of updatedPrice) {
          if (items) { 
            const { sku, newSellerPrice, date } = items;
            const orderItemIndex = order.orderItems.findIndex(
              (item) => item.SKU === sku,
            );
            if (orderItemIndex !== -1) {
              const orderHistory = {
                SKU: sku,
                quantity: null,
                newQuantity: null,
                Date: date,
                sellerPrice: order.orderItems[orderItemIndex].sellerPrice,
                newSellerPrice: newSellerPrice,
              };
              order.orderHistory.push(orderHistory);
              order.orderItems[orderItemIndex].sellerPrice = newSellerPrice;
            } else {
              throw new Error(`Sku ${sku} not found in updated price`);
            }
          }
        }
      }
  
      let totalSalesPrice = 0;
      let totalSellerPrice = 0;
      for (let item of order.orderItems) {
        totalSalesPrice += item.salesPrice * item.quantity;
        totalSellerPrice += item.sellerPrice * item.quantity;
      }
      order.subTotalSalesAmount = totalSalesPrice;
      order.subTotalSellerAmount = totalSellerPrice;
  
      await order.save();
      res
        .status(201)
        .send({ status: 'success', message: 'Order Updated Successfully' });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }
  
  

  // delete whole order by admin
  async deleteOrder(orderId: string, res: Response) {
    try {
      if (!orderId) {
        throw new BadRequestException('orderId is required');
      }
      const deleteOrder = await this.SellerOrderModel.findOneAndDelete({
        orderId: orderId,
      });
      if (!deleteOrder) {
        throw new BadRequestException(
          'Some error occured while deleting order',
        );
      }
      res
        .status(200)
        .send({ status: 'success', message: 'Order Deleted Successfully' });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // delete Single OrdeItem
  async deleteOrderItem(
    orderId: string,
    res: Response,
    deleteOrderItems: deleteOrderItemsDto,
  ) {
    try {
      if (!orderId) {
        throw new BadRequestException('OrderId is required');
      }
      const skus = deleteOrderItems.skus;
      const order = await this.SellerOrderModel.findOne({ orderId: orderId });

      const deleteItems = skus.map((sku: string) => {
        return order.orderItems.findIndex((item: any) => item.SKU === sku);
      });
      deleteItems.forEach((index: number) => {
        if (index !== -1) {
          const deletedItem: any = order.orderItems.splice(index, 1)[0];
          order.subTotalSalesAmount -=
            deletedItem.salesPrice * deletedItem.quantity;
          order.subTotalSellerAmount -=
            deletedItem.sellerPrice * deletedItem.quantity;
        }
      });

      await order.save();

      res
        .status(200)
        .send({ status: 'success', message: 'Order Items Deleted' });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }
}
