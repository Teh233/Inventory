import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Res,
  Req,
  UploadedFiles,
  UseInterceptors,
  Query,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  LoginAdminDto,
  RegisterAdminDto,
  forgetPasswordDto,
  resetPasswordDto,
  changePasswordDto,
} from './dto/create-admin.dto';
import { Response, Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Admin Register Route' })
  @ApiBody({
    type: RegisterAdminDto,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'Image', maxCount: 1 }]))
  adminRegister(
    @UploadedFiles() files: { Image?: Express.Multer.File[] },
    @Body() registerDto: RegisterAdminDto,
    @Res() res: Response,
  ): Promise<string> {
    return this.adminService.adminRegister(registerDto, res, files);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Admin Loging Route' })
  @ApiBody({
    type: LoginAdminDto,
  })
  adminLogin(
    @Body(ValidationPipe) loginDto: LoginAdminDto,
    @Res() res: Response,
  ) {
    return this.adminService.adminLogin(loginDto, res);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Admin Logout Route' })
  adminLogout(@Res() res) {
    return this.adminService.adminLogout(res);
  }

  @Post('/userRoleUpdate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin To User Role Update Route' })
  userRoleUpdate(
    @Req() req: Request,
    @Res() res: Response,
    @Query('Type') Type: String,
  ) {
    return this.adminService.userRoleUpdate(req, res, Type);
  }

  @Get('/getAllUserAdmin')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin To Get All User Route' })
  getAllUserAdmin(@Res() res: Response) {
    return this.adminService.getAllUserAdmin(res);
  }

  @Get('/getSingleUser/:adminId')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin To Get Single User Route' })
  getSingleUser(@Res() res: Response, @Param('adminId') adminId: string) {
    return this.adminService.getSingleUser(res, adminId);
  }

  @Post('/setMasterPassword')
  @ApiOperation({ summary: 'Admin To Set Master Password Route' })
  createOrUpdateMasterPassword(@Req() req: Request, @Res() res: Response) {
    return this.adminService.createOrUpdateMasterPassword(req, res);
  }

  // admin forget password
  @Post('/forgetPassword')
  @ApiOperation({ summary: 'Admin Forget Password Route' })
  @ApiBody({
    type: forgetPasswordDto,
  })
  forgetPassword(
    @Res() res: Response,
    @Body() forgetPassword: forgetPasswordDto,
  ) {
    return this.adminService.forgetPassword(res, forgetPassword);
  }
  // admin reset password
  @Put('/resetPassword/:token')
  @ApiOperation({ summary: 'Admin Reset Password Route' })
  @ApiBody({
    type: resetPasswordDto,
  })
  resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: resetPasswordDto,
    @Res() res: Response,
  ) {
    return this.adminService.resetPassword(resetPassword, token, res);
  }

  // admin change password
  @Put('/changePassword/:id')
  @ApiOperation({ summary: 'Admin Change Password Route' })
  @ApiBody({
    type: changePasswordDto,
  })
  @UseGuards(AdminAuthGuard)
  changePassword(
    @Param('id') adminId: string | any,
    @Body() changePasswordDto: changePasswordDto,
    @Res() res: Response,
  ) {
    return this.adminService.changePassword(changePasswordDto, adminId, res);
  }

  @Post('/verifyLoginOtp')
  verifyLoginOtp(@Req() req: Request, @Res() res: Response) {
    return this.adminService.verifyLoginOtp(req, res);
  }

  @Get('/getAllUserHistory')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin To Get All User Status History' })
  getAllUserHistory(@Param('page') page: number, @Res() res: Response) {
    return this.adminService.getAllLatestUserHistory(res, page);
  }
}
