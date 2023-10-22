import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class prices {
  @IsNumber()
  @IsNotEmpty()
  Quantity: Number;

  @IsNumber()
  @IsNotEmpty()
  RMB: Number;

  @IsNumber()
  @IsNotEmpty()
  USD: Number;

  @IsNumber()
  @IsNotEmpty()
  ConversionRate: Number;
}

export class CreatePricesHistoryDto {
  @IsString()
  @IsNotEmpty()
  SKU: String;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty() 
  priceHistory: prices[];
}
