import { IsNumber, IsString } from 'class-validator';

export class CreateLogisticDto {

  HAWB: string;

  @IsString()
  PI: string;

  @IsNumber()
  Box: Number;

  CI: string;

  LogisticDate:Date;

  @IsString()
  CourierType: string;
}

export class AddBoxesDto{
 
  weight:number;


  height:number;

 
  length:number;


  width:number;

  
  actWeight:number;


  marking:string;


  description:string;
}