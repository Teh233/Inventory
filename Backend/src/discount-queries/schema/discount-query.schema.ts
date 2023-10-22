import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DiscountQueryDocument = HydratedDocument<DiscountQuery>;
@Schema({ timestamps: true })
export class DiscountQuery {
  @Prop({ type: String, unique: true, required: true })
  QueryId: String;

  @Prop({ type: String })
  CustomerName: String;

  @Prop({ type: Number })
  MobileNo: Number;

  @Prop({ type: Array, required: true, default: [] })
  Data: [];

  @Prop({ type: String })
  message: String;

  @Prop({ type: Boolean, default: false })
  NewOffer: Boolean;

  @Prop({ type: Array, default: [] })
  NewOfferData: [];

  @Prop({type:Number,default:0})
  TotalSalesPrice:number;

  @Prop({type:Number,default:0})
  TotalDiscountPrice:number;

  @Prop({type:Number})
  GST5:number;

  @Prop({type:Number})
  GST18:number;

  @Prop({type:Number})
  CurentTotalProfit:number;

  @Prop({type:Number})
  AfterDiscountTotalProfit:number;

  @Prop({
    type: String,
    enum: ['close', 'sold', 'pending', 'newOffer'],
    default: 'pending',
  })
  status: String;
}

export const DiscountQueriesSchema =
  SchemaFactory.createForClass(DiscountQuery);
