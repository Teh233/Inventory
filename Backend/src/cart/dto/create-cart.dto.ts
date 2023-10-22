import {
  IsString,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class CartItem {
  @IsString()
  SKU: string;

  @IsString()
  name: string;

  @IsNumber()
  salesPrice: number;

  @IsNumber()
  sellerPrice: number;

  @IsNumber()
  quantity: number;
}
export class CreateCartDto {
  @IsNotEmpty({ message: 'SellerId Required' })
  sellerId: string;

  @IsNotEmpty({ message: 'RoboProduct Sku Required' })
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  cartProducts: CartItem[];
}
