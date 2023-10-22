import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Restock>;
export type OverseasOrderDocument = HydratedDocument<OverseasOrder>;
export type PriceComparisionDocument = HydratedDocument<PriceComparision>;

@Schema({ timestamps: true })
export class Restock {
  @Prop()
  restockId: string;

  @Prop([
    {
      SKU: { type: String },
      Name: { type: String },
      Brand: { type: String },
      Category: { type: String },
      Quantity: { type: Number },
      ThresholdQty: { type: Number },
      NewQuantity: { type: Number },
      Status: {
        type: String,
        enum: ['generated', 'processing', 'paid'],
        default: 'generated',
      },
      comparison: { type: Map, of: Number, default: {} },
    },
  ])
  products: {
    SKU: string;
    Name: string;
    Brand: string;
    Category: string;
    Quantity: number;
    ThresholdQty: number;
    NewQuantity: number;
    Status: string;
    comparison: { [vendorId: string]: number };
  }[];

  @Prop({ type: [String]})
  assign: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isAssigned: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isClosed: boolean;

  @Prop({ type: String, enum: ['pending', 'fullfilled'], default: 'pending' })
  status: string;
}

@Schema({ timestamps: true })
export class OverseasOrder {
  @Prop({ type: Types.ObjectId, ref: 'Restock' })
  restockId: Types.ObjectId;

  @Prop({ required: true })
  overSeasOrderId: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  VendorId: Types.ObjectId;

  @Prop([
    {
      SKU: { type: String },
      Name: { type: String },
      Brand: { type: String },
      Category: { type: String },
      Quantity: { type: Number },
      ThresholdQty: { type: Number },
      NewQuantity: { type: Number },
      Price: { type: Number },
      Status: {
        type: String,
        enum: ['generated', 'processing', 'paid'],
        default: 'generated',
      },
    },
  ])
  products: {
    SKU: string;
    Name: string;
    Brand: string;
    Category: string;
    Quantity: number;
    Price: number;
    ThresholdQty: number;
    NewQuantity: number;
    Status: string;
  }[];

  @Prop()
  Reciept: string;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'recieved'],
    default: 'pending',
  })
  status: string;
}

@Schema({ timestamps: true })
export class PriceComparision {
  @Prop()
  compareId: string;

  @Prop([
    {
      SKU: { type: String },
      Name: { type: String },
      Brand: { type: String },
      Category: { type: String },
      Quantity: { type: Number },
      ThresholdQty: { type: Number },
      NewQuantity: { type: Number },
      Status: {
        type: String,
        enum: ['generated', 'processing', 'paid'],
        default: 'generated',
      },
      comparison: {},
    },
  ])
  products: {
    SKU: string;
    Name: string;
    Brand: string;
    Category: string;
    Quantity: number;
    ThresholdQty: number;
    NewQuantity: number;
    Status: string;
    comparison: {};
  }[];

  @Prop({ type: [String] })
  assign: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isAssigned: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isClosed: boolean;

  @Prop({ type: String, enum: ['pending', 'fullfilled'], default: 'pending' })
  status: string;
}
export const restockSchema = SchemaFactory.createForClass(Restock);
export const overseasOrderSchema = SchemaFactory.createForClass(OverseasOrder);
export const PriceComparisionSchema = SchemaFactory.createForClass(PriceComparision);
