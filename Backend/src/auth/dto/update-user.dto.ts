import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto,LoginUserDto } from './create-user.dto';


export class UpdateRegisterDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends PartialType(LoginUserDto) {}