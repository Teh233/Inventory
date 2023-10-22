import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpoDocument = HydratedDocument<Expo>;

@Schema({timestamps:true})
export class Expo {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobileNo: number;

  @Prop()
  companyName: string;
}

export const ExpoSchema = SchemaFactory.createForClass(Expo);
