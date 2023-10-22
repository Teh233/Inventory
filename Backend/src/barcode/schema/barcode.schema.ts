import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Barcode Serial number generated Schema
export type barcodeGenDocument = HydratedDocument<BarcodeGen>;
@Schema({timestamps:true})
export class BarcodeGen {
  save() {
    throw new Error('Method not implemented.');
  }
  @Prop({ type: String, required: true })
  SKU: string;

  @Prop([
    {
      serialNumber: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      isProcessed: { type: Boolean, default: false },
      isRejected: { type: Boolean, default: false },
      sub: { type: Object },
    },
  ])
  SNo: {
    serialNumber: string;
    createdAt: Date;
    isProcessed: boolean;
    isRejected: boolean;
    sub: object;
  }[];
}

// Barcode Serial Number History Schema which is dispatched
export type barcodeHistoryDocument = HydratedDocument<BarcodeHistory>;
@Schema({ timestamps: true })
export class BarcodeHistory {
  @Prop()
  SKU: string;

  @Prop()
  Name: string;

  @Prop()
  Brand: string;

  @Prop()
  MRP: string;

  @Prop([
    {
      serialNumber: { type: String, required: true },
      dispatchedAt: { type: Date, default: new Date() },
      sub: { type: Object },
    },
  ])
  SNo: { serialNumber: string; dispatchedAt: Date; sub: { key: string }[] }[];
}

// Barcode Serial Number Return Schema
export type barcodeReturn = HydratedDocument<BarcodeReturn>;
@Schema({ timestamps: true })
export class BarcodeReturn {
  @Prop({ type: String })
  SKU: string;

  @Prop({ type: String })
  Name: String;

  @Prop({ type: String })
  Brand: String;

  @Prop({
    serialNumber: { type: String, default: 'Return' },
  })
  type: string;

  @Prop([
    {
      serialNumber: { type: String },
      returedAt: { type: Date, default: Date.now },
    },
  ])
  SNo: { serialNumber: string; returnedAt: Date }[];
}

export type salesHistory = HydratedDocument<SalesHistory>;
@Schema({timestamps:true})
export class SalesHistory {
  @Prop({ type: String })
  CustomerName: string;

  @Prop({ type: Number })
  MobileNo: Number;

  @Prop({ type: Date, default:Date.now})
  Date: Date;

  @Prop({ type: String })
  InvoiceNo: string;

  @Prop({ type: Array })
  Barcode: [string];
}

export const barcodeGenSchema = SchemaFactory.createForClass(BarcodeGen);
export const barcodeHistorySchema =
  SchemaFactory.createForClass(BarcodeHistory);
export const barcodeReturnSchema = SchemaFactory.createForClass(BarcodeReturn);
export const salesHistorySchema = SchemaFactory.createForClass(SalesHistory);
