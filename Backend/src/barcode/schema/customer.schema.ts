import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type customerDocs = HydratedDocument<Customer>

@Schema()
export class Customer
{
@Prop({type:String})
name:string;

@Prop({type:String})
company:string;

@Prop({type:String})
mobileNo:string;

@Prop({type:String})
email:string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)