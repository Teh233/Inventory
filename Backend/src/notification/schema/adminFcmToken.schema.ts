import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<AdminFcmtoken>;

@Schema()
export class AdminFcmtoken {
  @Prop({ required: true })
  adminId: string;

  @Prop()
  fcmToken: string;
}

export const AdminFcmTokenSchema = SchemaFactory.createForClass(AdminFcmtoken);