import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InviteeDocumnent = HydratedDocument<Invitee>;
export type CompanyDocumnent = HydratedDocument<Company>;

@Schema({timestamps:true})
export class Invitee {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobileNo: number;

  @Prop()
  companyName: string;

  @Prop()
  designation: string;
  @Prop()
  VisitorsType: string;

  @Prop({type:{}})
  image:{
    fileId:string,
    url:string
  }
}


@Schema({timestamps:true})
export class Company{
    @Prop()
    companyName:string;

    @Prop()
    companyMail:string;
    
    @Prop()
    State:string;

    @Prop()
    City:string;

    @Prop()
    Category:string;

    @Prop()
    CompanyBorn:string;
}

export const InviteeSchema = SchemaFactory.createForClass(Invitee);
export const CompanySchema = SchemaFactory.createForClass(Company);
  