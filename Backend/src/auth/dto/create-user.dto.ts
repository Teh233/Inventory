import { IsString, IsEmail, IsNotEmpty, IsNumber, IsEmpty } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  companyName:string;

  @IsEmail({}, { message: 'Invalid email format' }) // Custom error message for email validation
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' }) // Custom error message for empty password
  @ApiProperty()
  password: string;

  @IsNumber()
  @IsNotEmpty({})
  @ApiProperty()
  mobileNo: number;

  @ApiHideProperty()
  otp: number;

  @ApiHideProperty()
  createdAt: Date;
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email format' }) // Custom error message for email validation
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' }) // Custom error message for empty password
  @ApiProperty()
  password: string;
}

export class otpVerification {
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty()
  email: string;

  @ApiProperty()
  otp: number;
}

export class changePasswordDto {
  @ApiProperty()
  oldPassword: string;
  @ApiProperty()
  newPassword: string;
}

export class forgetPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  @ApiProperty()
  email: string;
}

export class resetPasswordDto {
  @ApiProperty()
  newPassword: string;
}

export class personalQueryDto {
  @ApiProperty()
  personalQuery: string;
}
