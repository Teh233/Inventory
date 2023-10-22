import {
  IsString,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class OrderItem {
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

class Address {
  @IsNumber()
  mobileNo: number;

  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsNumber()
  pincode: number;

  @IsString()
  addressLine1: string;

  AddressLine2: string;
}

export class SellerOrderDto {
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  subTotalSalesAmount: number;

  @IsNotEmpty()
  @IsNumber()
  subTotalSellerAmount: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orderItems: OrderItem[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  billAddress: Address;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  shipAddress: Address;
}

export class updateOrderStatusDto{
  @IsString()
  status:string;
}

export class updateOrderItemsDto{
  orderItems: { sku: string; qty: number }[];
}
export class deleteOrderItemsDto{

  skus:[];
}