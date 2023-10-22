import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<SellerAdmin>;
export type UserHistorytype = HydratedDocument<UserHistory>;

interface profileImage {
  fileId: string;
  url: string;
}
@Schema()
export class SellerAdmin {
  @Prop()
  adminId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: [true],
    unique: [true, 'email is already available'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  Department: string;

  @Prop({ type: Object })
  profileImage: profileImage;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Number })
  loginOtp: number;

  @Prop({ type: String })
  unique: string;

  @Prop({ default: [] })
  userRoles: [];

  @Prop({ default: [] })
  productColumns: [];

  @Prop({ default: [] })
  hiddenColumns: [];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpire: number;
}

@Schema({ timestamps: true })
export class UserHistory {
  @Prop({})
  userId: string;

  @Prop({})
  message: string;

  @Prop({ type: Date, default: Date.now() })
  Date: Date;

  @Prop({ type: String, enum: ['login', 'update'] })
  type: string;

  @Prop({ type: String, enum: ['seller', 'user'] })
  by: string;
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);
export const AdminSchema = SchemaFactory.createForClass(SellerAdmin);
