import { Module } from '@nestjs/common';
import { SellerOrderController } from './seller-order.controller';
import { SellerOrderService } from './seller-order.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  roboproducts,
  roboProductSchema,
} from 'src/robo-products/schema/robo-products.schema';
import { SellerOrder, SellerOrderSchema } from './schema/seller-order.schema';
import { Seller, SellerSchema } from 'src/auth/schema/users.schema';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { WebsocketEventsModule } from 'src/websocket-events/websocket-events.module';
import {
  SellerDocument,
  SellerDocumentSchema,
} from 'src/seller-document/schema/seller-document.schema';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerOrder.name, schema: SellerOrderSchema },
      { name: Seller.name, schema: SellerSchema },
      { name: Cart.name, schema: CartSchema },
      { name: SellerDocument.name, schema: SellerDocumentSchema },
      { name: roboproducts.name, schema: roboProductSchema },
    ]),
    AuthModule,
    AdminModule,
    NotificationModule,
    WebsocketEventsModule,
  ],
  controllers: [SellerOrderController],
  providers: [SellerOrderService],
})
export class SellerOrderModule {}
