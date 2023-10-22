import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CalcDocument = HydratedDocument<Calc>;

@Schema({ timestamps: true })
export class Calc {
  @Prop({ type: String, required: true })
  CalcId: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Array, required: true })
  Product: [];

  @Prop({ type: {} })
  weightState: {};

  @Prop({ type: {} })
  shippingState: {};

  @Prop({ type: {} })
  priceState: {};

  @Prop({ type: {} })
  otherChargeState: {};

  @Prop({ type: {} })
  finalCalcTotal: {};
}

export const CalcSchema = SchemaFactory.createForClass(Calc);
