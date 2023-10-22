import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogisticDocument = HydratedDocument<Logistic>;

export interface Box {
  weight: number;
  length: number;
  width: number;
  height: number;
  actWeight: number;
  photo?: string;
  marking: string;
  description: string;
}

@Schema()
export class Logistic {
  @Prop()
  logisticId: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  Date: Date;

  @Prop({ required: true })
  Hawb: string;

  @Prop()
  CourierType: string;

  @Prop()
  Pi: string;

  @Prop()
  Ci: string;

  @Prop()
  LogisticDate: Date;

  @Prop()
  Box: number;

  @Prop({ type: [] })
  NoOfBox: Box[];

  @Prop({ default: 'notSubmit' })
  Note: 'submit' | 'notSubmit' | 'inOffice';
}

export const LogisticSchema = SchemaFactory.createForClass(Logistic);
