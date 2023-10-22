import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { Seller, SellerSchema } from 'src/auth/schema/users.schema';
import {
  roboproducts,
  roboProductSchema,
} from 'src/robo-products/schema/robo-products.schema';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';
import { NotificationModule } from 'src/notification/notification.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Seller.name, schema: SellerSchema },
      { name: roboproducts.name, schema: roboProductSchema },
    ]),
   AuthModule,AdminModule,NotificationModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
