import { PartialType } from '@nestjs/swagger';
import { CreateExpoDto } from './create-expo.dto';

export class UpdateExpoDto extends PartialType(CreateExpoDto) {}
