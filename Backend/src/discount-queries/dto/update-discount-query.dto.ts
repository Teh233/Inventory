import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountQueryDto } from './create-discount-query.dto';

export class UpdateDiscountQueryDto extends PartialType(CreateDiscountQueryDto) {}
