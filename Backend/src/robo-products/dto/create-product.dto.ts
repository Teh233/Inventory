import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class addRoboProductDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsString()
  brand: String;

  @IsString()
  category: String;

  @IsString()
  subCategory: String;

  @IsNumber()
  weight: Number;

  @IsNumber()
  gst: Number;

  @IsObject()
  dimensions: { length: Number; width: Number; height: Number };

  subItems: [Object];
}

export class addProducutBulkDto {
  @IsArray()
  @Type(() => addRoboProductDto)
  products: addRoboProductDto[];
}

export class salesPriceDto {
  salesPrice: number;
}

export class updateSinglePriceDto {
  sellerPrice: number;
}

export class UpdateOneRoboProductDto {
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  weight: number;
  sellertax: number;
  salestax: number;
  dimensions: { length: Number; width: Number; height: Number };
  subItems: [];
}
