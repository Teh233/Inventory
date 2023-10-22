import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import { HydratedDocument  } from "mongoose";
export type BrandDocument = HydratedDocument<Brand>


@Schema()
export class Brand{
    @Prop({type:String})
    BrandId:string;

    @Prop({type:String})
    BrandName:string;

    @Prop({type:{}})
    BrandImage:{fileId:string,url:string}
    
}


export const BrandSchema = SchemaFactory.createForClass(Brand)