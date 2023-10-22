import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Fcmtoken>;

@Schema()
export class Fcmtoken {
  @Prop({ required: true })
  sellerId: string;

  @Prop()
  fcmToken: string;
}

export const FcmTokenSchema = SchemaFactory.createForClass(Fcmtoken);