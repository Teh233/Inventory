import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PricesHistoryDocument = HydratedDocument<PricesHistory>;

interface price {
  Quantity: Number;
  RMB: Number;
  USD: Number;
  ConversionRate: Number;
  Date: Date
}

@Schema()
export class PricesHistory {
  @Prop({ type: String })
  SKU: String;

  @Prop([{ type: Object }])
  PriceHistory: price[];
}

export const PricesHistorySchema = SchemaFactory.createForClass(PricesHistory);
