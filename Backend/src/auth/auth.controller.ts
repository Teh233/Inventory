import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  changePasswordDto,
  CreateUserDto,
  forgetPasswordDto,
  LoginUserDto,
  otpVerification,
  personalQueryDto,
  resetPasswordDto,
} from './dto/create-user.dto';
import { Response } from 'express';
import {
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { Seller } from './schema/users.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth Seller")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // user register/signup

  @Post('/signup')
  @ApiOperation({ summary: 'User Register Route' })
  @ApiBody({
    type: CreateUserDto, // Replace with the appropriate DTO class for your request body
  })
  register(
    @Body(ValidationPipe) registerDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<string> {
    return this.authService.register(registerDto, res);
  }

  // user login route
  
  @Post('/login')
  @ApiOperation({ summary: 'User Login Route' })
  @ApiBody({
    type: LoginUserDto, // Replace with the appropriate DTO class for your request body
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(
    @Body(ValidationPipe) loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    return this.authService.login(loginDto, res);
  }

  // user logout route
  @Post('/logout')
  @ApiOperation({ summary: 'User Logout Route' })
  logout(@Res({ passthrough: true }) res: Response): Promise<object> {
    return this.authService.logout(res);
  }

  // user otp verification
  @Post('/otpVerification')
  @ApiOperation({ summary: 'User Otp Verification Route' })
  @ApiBody({
    type: otpVerification, // Replace with the appropriate DTO class for your request body
  })
  otpVerification(
    @Body(ValidationPipe) otpVerification: otpVerification,
    @Res() res: Response,
  ) {
    return this.authService.otpVerification(otpVerification, res);
  }

  // user opt generate
  @Post('/otpReGenerate')
  @ApiOperation({ summary: 'User Otp ReGenerate Route' })
  otpReGenerate(@Body() body:any, @Res() res: Response) {
    return this.authService.otpReGenerate(body, res);
  }

  // user change password
  @Put('/changePassword/:id')
  @ApiBody({
    type: changePasswordDto, // Replace with the appropriate DTO class for your request body
  })
  @ApiOperation({ summary: 'User Change Password Route' })
  @UseGuards(AuthGuard())
  changePassword(
    @Param('id') sellerId: string | any,
    @Body() changePasswordDto: changePasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.changePassword(changePasswordDto, sellerId, res);
  }

  // user forget password
  @Post('/forgetPassword')
  @ApiOperation({ summary: 'User Forget Password Route' })
  @ApiBody({
    type: forgetPasswordDto, // Replace with the appropriate DTO class for your request body
  })
  forgetPassword(
    @Body(ValidationPipe) forgetPasswordDto: forgetPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.forgetPassword(forgetPasswordDto, res);
  }

  // user reset password
  @Put('/resetPassword/:token')
  @ApiOperation({ summary: 'User Reset Password Route' })
  @ApiBody({
    type: resetPasswordDto, // Replace with the appropriate DTO class for your request body
  })
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: resetPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token, res);
  }

  // upser upload profile
  @Post('/uploadProfile/:sellerId')
  @ApiOperation({ summary: 'User Upload Profile Route' })
  @UseInterceptors(
    FileInterceptor('profilePic', {
      storage: diskStorage({
        destination: './uploads/sellerProfile',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExt = file.originalname.split('.')[1];
          const newFileName = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExt;
          callback(null, newFileName);
        },
      }),
    }),
  )
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('sellerId') sellerId: string,
    @Res() res: Response,
  ) {
    console.log(file)
    if (!file) {
      // Handle the case when no file is uploaded
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }
    return this.authService.uploadProfile(res, sellerId, file);
  }

  // for testing
  @Get('/authenticated')
  @ApiOperation({ summary: 'Route For Testing' })
  @UseGuards(AuthGuard())
  authenticatedRoute(@Req() req: Request & { user: Seller }) {
    const seller = req.user;
    return this.authService.authenticatedRoute(seller);
  }

  ////  admin section //////

// admin to get all selller 
  @Get('/admin/allSeller')
  @ApiOperation({ summary: 'Admin To Get All Seller Route' })
  getAllSeller(@Query('query') query: string, @Res() res: Response) {
    return this.authService.getAllSeller(res, query);
  }

  // update seller personalQuery for admin
  @Put('/admin/verify/:sellerId')
  @ApiOperation({ summary: 'Admin To Verify Seller Route' })
  @ApiBody({
    type: personalQueryDto, // Replace with the appropriate DTO class for your request body
  })
  verifySeller(
    @Param('sellerId') sellerId: string,
    @Body() queryStatus: personalQueryDto,
    @Res() res: Response,
  ) {
    return this.authService.verifySeller(sellerId, res, queryStatus);
  }
}
