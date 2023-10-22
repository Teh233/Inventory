import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

interface BankDetails {
  accountNumber: string;
  bankName: string;

  // Add more properties specific to bank details
}

interface ChineseBankDetails {
  accountNumber: string;
  bankName: string;
  // Add more properties specific to Chinese bank details
}

interface Address {
  street: string;
  city: string;
  // Add more address properties
}

interface Link {
  name: string;
  url: string;
  // Add more link properties
}

interface Photo {
  url: string;
  // Add more photo properties
}

interface PDF {
  url: string;
  // Add more PDF properties
}

export type VendorDocument = HydratedDocument<Vendor>;
export type ClientUserDocument = HydratedDocument<ClientUser>;

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ required: true })
  CompanyName: string;

  @Prop()
  ChineseCompanyName: string;

  @Prop({ required: true })
  ConcernPerson: string;

  @Prop()
  ChineseConcernPerson: string;

  @Prop()
  Website: string;

  @Prop()
  Email: string;

  @Prop({ type: Array })
  BankDetails: BankDetails[];

  @Prop({ type: Array })
  ChineseBankDetails: ChineseBankDetails[];

  @Prop()
  Country: string;

  @Prop()
  FaxDetails: string;

  @Prop()
  Mobile: string;

  @Prop()
  Tele: string;

  @Prop()
  Pincode: number;

  @Prop({ type: Array })
  address: Address[];

  @Prop({ type: Array })
  Links: Link[];

  @Prop({ type: Array })
  Chineseaddress: Address[];

  @Prop({ type: Array })
  photo: Photo[];

  @Prop({ type: Array })
  pdf: PDF[];

  @Prop({ required: true, unique: true })
  VendorId: string;

  @Prop()
  comment: string;

  @Prop({ default: false })
  isClient: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({timestamps:true})
export class ClientUser {
  @Prop({
    type: String,
    required: true,
  })
  CompanyName: string;

  @Prop({
    type: String,
    unique: true,
  })
  VendorId: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Number,
    default: 0,
  })
  balanceUSD: Number;

  @Prop({
    type: Number,
    default: 0,
  })
  balanceRMB: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
    required: true,
    enum: ['RMBandUSD', 'USD', 'RMB'],
  })
  clientType: string;

  @Prop({
    type: Object,
    default: {
      conversion: false,
      payment: false,
      purchase: false,
      shipment: false,
    },
  })
  Notification: {};
  @Prop({
    type: String,
  })
  otherInfo: string;
}

export const vendorSchema = SchemaFactory.createForClass(Vendor);
export const clientUserSchema = SchemaFactory.createForClass(ClientUser);
