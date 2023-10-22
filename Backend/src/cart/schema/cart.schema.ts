import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop()
  sellerId: string;

  @Prop([
    {
      SKU: { type: String },
      quantity: { type: Number },
      sellerPrice: { type: Number },
      salesPrice: { type: Number },
      name: { type: String },
    },
  ])
  cartProducts: [];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
