import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type roboProductsDocument = HydratedDocument<roboproducts>;
interface image {
  fileId: string;
  url: string;
}
interface MainImage {
  filter(arg0: (image: any) => boolean): unknown;
  fileId: string;
  lowUrl: string;
  mediumUrl: string;
  highUrl: string;
}

@Schema({ timestamps: true })
export class roboproducts {
  @Prop()
  SKU: String;

  @Prop()
  Name: String;

  @Prop()
  Brand: String;

  @Prop()
  Category: String;

  @Prop()
  SubCategory: String;

  @Prop({
    default: 0,
  })
  Weight: Number;

  @Prop({
    default: 0,
  })
  SalesPrice: Number;

  @Prop({
    default: 0,
  })
  SellerTax: Number;

  @Prop({
    default: 0,
  })
  SalesTax: Number;

  @Prop({ default: 0 })
  SellerPrice: Number;

  @Prop({ default: 0 })
  LandingCost: Number;

  @Prop({ default: 0 })
  Quantity: number;

  @Prop({ type: Number, default: 0 })
  ThresholdQty: number;

  @Prop({ default: 0 })
  GST: Number;

  @Prop({ default: 0 })
  MRP: Number;

  @Prop({ type: Number, default: 0 }) // Set default value to 0 for "ActualQuantity"
  ActualQuantity: number;

  @Prop([
    {
      fileId: { type: String },
      lowUrl: { type: String },
      mediumUrl: { type: String },
      highUrl: { type: String },
    },
  ])
  sideImage: [image];

  @Prop({ type: Object })
  mainImage: MainImage;

  @Prop({ type: Array })
  subItems: [];

  @Prop({
    enum: ['New', 'Offer', 'Pre Order'],
  })
  Notation: String;

  @Prop({
    type: Object, // Add type option for Dimensions
    default: {
      length: 0,
      width: 0,
      height: 0,
    },
  })
  Dimensions: Object;

  @Prop({ type: Number, default: 0 })
  PendingQuantity: number;

  @Prop({ type: Number, default: 0 })
  PendingMRP: number;

  @Prop({ type: Number, default: 0 })
  PendingSalesPrice: number;

  @Prop({ type: Number, default: 0 })
  PendingSellerPrice: number;

  @Prop({ type: Number, default: 0 })
  PendingLandingCost: number;

  @Prop({ type: Boolean, default: true })
  isVerifiedQuantity: boolean;

  @Prop({ type: Boolean, default: false })
  isRejectedQuantity: boolean;

  @Prop({ type: Boolean, default: true })
  isVerifiedMRP: boolean;

  @Prop({ type: Boolean, default: false })
  isRejectedMRP: boolean;

  @Prop({ type: Boolean, default: true })
  isVerifiedSalesPrice: boolean;

  @Prop({ type: Boolean, default: false })
  isRejectedSalesPrice: boolean;

  @Prop({ type: Boolean, default: true })
  isVerifiedSellerPrice: boolean;

  @Prop({ type: Boolean, default: false })
  isRejectedSellerPrice: boolean;

  @Prop({ type: Boolean, default: true })
  isVerifiedLandingCost: boolean;

  @Prop({ type: Boolean, default: false })
  isRejectedLandingCost: boolean;

  @Prop({ type: Boolean, default: false })
  isFullFilled: boolean;

  @Prop({ type: Boolean, default: false })
  isEcwidSync: boolean;

  @Prop({ type: Boolean, default: false })
  isWholeSaleActive: boolean;

  @Prop({ type: String })
  other: string;
}

export type roboProductHistoryDocument = HydratedDocument<roboproducthistory>;

@Schema({ timestamps: true })
export class roboproducthistory {
  @Prop()
  SKU: String;

  @Prop()
  Date: Date;

  @Prop({ default: 0 })
  Quantity: number;

  @Prop({ default: 0 })
  GST: Number;

  @Prop({ default: 0 })
  LandingCost: Number;

  @Prop({ default: 0 })
  SalesPrice: Number;

  @Prop({ default: 0 })
  SellerPrice: Number;

  @Prop({ default: 0 })
  MRP: Number;

  @Prop({
    enum: [
      'gst',
      'mrp',
      'salesPrice',
      'quantity',
      'landingCost',
      'sellerPrice',
    ],
  })
  Type: String;
}

export const roboProductSchema = SchemaFactory.createForClass(roboproducts);

export const roboProductHistorySchema =
  SchemaFactory.createForClass(roboproducthistory);
