import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class RegisterAdminDto {
@IsNotEmpty({ message: 'Name should not be empty' })
@IsString()
name:string;

@IsString()
@IsEmail({}, { message: 'Invalid email format' })
@IsNotEmpty({ message: 'Email should not be empty' })
email:string;

@IsNotEmpty({ message: 'Password should not be empty' })
password:string;

@IsNotEmpty({ message: 'Department is required' })
department:string;
}

export class LoginAdminDto{
    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Password should not be empty' })
    email:string;
    
    @IsNotEmpty({ message: 'Password should not be empty' })
    password:string;

    fcmAdminToken:string

    // uniqueId:string;
    unique:string

    Location:any
}

export class changePasswordDto{
    oldPassword:string;
    newPassword:string
  }

  export class forgetPasswordDto{
    @IsEmail({}, { message: 'Invalid email format' })
    @IsString()
    email:string
  }

  export class resetPasswordDto{
    newPassword:string
  }
