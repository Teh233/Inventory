import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Seller>;

@Schema()
export class Seller {
  status(arg0: number) {
    throw new Error('Method not implemented.');
  }
  @Prop()
  sellerId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: [true],
    unique: [true, 'email is already available'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  mobileNo: number;

  @Prop()
  otp: number;

  @Prop({ default: false })
  isOtpVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpire: number;

  @Prop({
    enum: ['not_submit', 'submit', 'verify','reject'],
    default: 'not_submit',
  })
  personalQuery: string;

  @Prop()
  profile:string;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);

