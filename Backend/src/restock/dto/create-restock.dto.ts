import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RestockDto {
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsString()
  Brand: string;

  @IsString()
  Category: string;

  @IsNumber()
  @IsNotEmpty()
  NewQuantity: number;

  @IsNumber()
  ThresholdQty: number; 

  @IsNotEmpty()
  Quantity: number;
}

export class CreateRestockRequestDto {
  @IsArray()
  @Type(() => RestockDto)
  restocks: RestockDto[];
}

export class ProductComparisonDto {
  [vendorId: string]: number;
}

export class ProductDto {
  SKU: string;
  comparison: ProductComparisonDto;
}

export class UpdatePriceRequestDto {
  restockId: string;
  vendorId: string;
  products: [];
}

export class CreatePriceComparisionDto {
  @IsArray()
  @Type(() => RestockDto)
  priceComparision: RestockDto[];
}
