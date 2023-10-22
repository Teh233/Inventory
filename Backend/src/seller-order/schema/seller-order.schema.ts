import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SellerOrders = HydratedDocument<SellerOrder>;

@Schema({ timestamps: true })
export class SellerOrder {
  @Prop()
  sellerId: string;

  @Prop()
  orderId: string;

  @Prop([
    {
      SKU: { type: String },
      quantity: { type: Number },
      sellerPrice: { type: Number },
      salesPrice: { type: Number },
      name: { type: String },
    },
  ])
  orderItems: [];

  @Prop()
  subTotalSalesAmount: number;
  @Prop()
  subTotalSellerAmount: number;
 
  @Prop([
    {
      SKU: { type: String },
      quantity: { type: Number },
      sellerPrice: { type: Number },
      newQuantity:{type:Number},
      newSellerPrice:{type:Number},
      Date:{type:String}
    },
  ])
  orderHistory: [];



  @Prop({
    type: {
      mobileNo: Number,
      name: String,
      city: String,
      state: String,
      country: String,
      pincode: Number,
      addressLine1: String,
      addressLine2: String,
    },
  })
  shipAddress: {
    mobileNo: number;
    name: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
    addressLine1: string;
    addressLine2: string;
  };

  @Prop({
    type: {
      mobileNo: Number,
      name: String,
      city: String,
      state: String,
      country: String,
      pincode: Number,
      addressLine1: String,
      addressLine2: String,
    },
  })
  billAddress: {
    mobileNo: number;
    name: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
    addressLine1: string;
    addressLine2: string;
  };

  @Prop({ enum: ['in Transit', 'Booked', 'delivered'], default: 'Booked' }) // Add default value 'pending'
  status: string;
}

export const SellerOrderSchema = SchemaFactory.createForClass(SellerOrder);
