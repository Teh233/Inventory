import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SellerDetailsDocument = SellerDocument & Document;

interface Address {
  [x: string]: any;
  name: string;
  mobileNo: number;
  city: string;
  state: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  pincode: number;
}

interface FileReference {
  fileId: string;
  url: string;
}

@Schema()
export class SellerDocument {
  @Prop()
  sellerId: string;

  @Prop()
  concernPerson: string;

  @Prop()
  companyName: string;

  @Prop()
  companyType: string;

  @Prop()
  mobileNo: number;

  @Prop()
  email: string;

  @Prop()
  gst: string;

  @Prop()
  msme: string;

  @Prop()
  bankName: string;

  @Prop()
  bankType: string;

  @Prop()
  bankBranch: string;

  @Prop()
  nameOfBeneficiary: string;

  @Prop()
  accountNumber: number;

  @Prop()
  accountType: string;

  @Prop()
  ifscCode: string;

  @Prop()
  alternateCompanyName: string;

  @Prop()
  alternateMobileNo: number;

  @Prop()
  alternateEmailId: string;

  @Prop({ type: Object })
  cancelCheque: FileReference;

  @Prop({ type: Object })
  companyLogo: FileReference;
  @Prop([
    {
      name: { type: String },
      mobileNo: { type: Number },
      city: { type: String },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
    },
  ])
  address: Address[];

  @Prop()
  defaultBilling: string;

  @Prop()
  defaultShipping: string;

  @Prop({
    type: {
      gstFile: Object,
      msmeFile: Object,
    },
  })
  files: {
    gstFile: FileReference;
    msmeFile: FileReference;
  };
}

export const SellerDocumentSchema = SchemaFactory.createForClass(SellerDocument);
