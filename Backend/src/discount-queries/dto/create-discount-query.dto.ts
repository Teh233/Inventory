import { IsArray, IsNumber, IsString } from "class-validator";


export class CreateDiscountQueryDto {
    @IsString()
    CustomerName:String;

    @IsNumber()
    MobileNo:Number;

    @IsArray()
    Data:[];

    @IsString()
    Message:String;

    @IsString()
    status:String;

}

export class UpdateDiscountQueryDto{

    NewOfferData: [];
    CurentTotalProfit:number;
    AfterDiscountTotalProfit:number

    // @IsNumber()
    // NewOfferPrice:Number
  }