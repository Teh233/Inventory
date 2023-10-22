import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  Put,
  Param,
  Delete,
  Get,
  Req,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { Response, Request, query } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  SellerAddessDto,
  SellerDocumentDto,
  UpdateSellerAddressDto,
  updateSellerdetailsDto,
} from './dto/create-seller-document.dto';
import { SellerDocumentService } from './seller-document.service';
import { SellerAuthGuard } from 'src/auth/guards/seller-auth.guard';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import {  ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Seller-Documents Api')
@Controller('seller-document')
export class SellerDocumentController {
  constructor(private readonly sellerDocumentService: SellerDocumentService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Add Seller Document Route' })
  @UseGuards(SellerAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'gstFile', maxCount: 1 },
      { name: 'msmeFile', maxCount: 1 },
      { name: 'logoFile', maxCount: 1 },
      { name: 'chequeFile', maxCount: 1 },
    ]),
  )
  createSellerDocument(
    @UploadedFiles()
    files: {
      gstFile?: Express.Multer.File[];
      msmeFile?: Express.Multer.File[];
      logoFile?: Express.Multer.File[];
      chequeFile?: Express.Multer.File[];
    },
    @Body(ValidationPipe) sellerDocumentDto: SellerDocumentDto,
    @Res() res: Response,
    @Req() req:Request
  ) {

    return this.sellerDocumentService.createSellerDocument(
      sellerDocumentDto,
      res,
      files,
      req
    );
  }

  @Post('/addAddress')
  @ApiOperation({ summary: 'Add Address Route' })
  @UseGuards(SellerAuthGuard)
  addAddressForSeller(
    @Body() sellerAddressDto: SellerAddessDto,
    @Res() res: Response,
  ) {
    return this.sellerDocumentService.addAddressForSeller(
      sellerAddressDto,
      res,
    );
  }

  @Put('/:sellerId/address/:addressId')
  @ApiOperation({ summary: 'Update Single Address By AddressId Route' })
  @UseGuards(SellerAuthGuard)
  updateAddress(
    @Param('sellerId') sellerId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateSellerAddressDto,
    @Res() res: Response,
  ) {
    return this.sellerDocumentService.updateAddress(
      updateAddressDto,
      sellerId,
      addressId,
      res,
    );
  }

  @Delete('/address/:sellerId/:addressId')
  @ApiOperation({ summary: 'Delete Single Address By AddressId Route' })
  @UseGuards(SellerAuthGuard)
  deleteAddress(
    @Param('sellerId') sellerId: string,
    @Param('addressId') addressId: string,
    @Res() res: Response,
  ) {
    return this.sellerDocumentService.deleteAddress(sellerId, addressId, res);
  }

  @Get('/getAddress/:sellerId')
  @ApiOperation({ summary: 'Get All Address For Single Seller Route' })
  @UseGuards(SellerAuthGuard)
  getAddress(@Param('sellerId') sellerId: string, @Res() res: Response) {
    return this.sellerDocumentService.getAddress(res, sellerId);
  }

  @Put('/setDefaultAddress/:sellerId')
  @ApiOperation({ summary: 'Set Default Address Route' })
  @UseGuards(SellerAuthGuard)
  setDefaultAddress(
    @Param('sellerId') sellerId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.sellerDocumentService.setDefaultAddress(res, req, sellerId);
  }

  @Get('/getSellerDetails/:sellerId')
  @ApiOperation({ summary: 'Get Seller Details  Route' })
  @UseGuards(SellerAuthGuard)
  getSellerDetails(@Param('sellerId') sellerId: string, @Res() res: Response,@Req() req:Request) {
    return this.sellerDocumentService.getSellerDetails(res,req);
  }

  @Put('/editSellerDocs/:sellerId')
  @ApiOperation({ summary: 'Update Seller Documents Route' })
  @UseGuards(SellerAuthGuard)
  updateSellerDocs(
    @Param('sellerId') sellerId: string,
    @Res() res: Response,
    @Body() updateDto: updateSellerdetailsDto,
  ) {
    return this.sellerDocumentService.updateSellerDocs(
      res,
      sellerId,
      updateDto,
    );
  }

  @Put('/updateSellerDetails/:sellerId')
  @ApiOperation({ summary: 'Update Seller Documents Route' })
  // @UseGuards(SellerAuthGuard)
  updateSellerAllDetails(
    @Param('sellerId') sellerId: any,
    @Res() res: Response,
    @Body() updateData: any,
  ) {
    return this.sellerDocumentService.updateSellerAllDetails(
      sellerId,
      res,
      updateData,
    );
  }

  @Put(':sellerId/files/:query')
  @UseInterceptors(FileInterceptor('file'))
  updateFiles(
    @Param('sellerId') sellerId: string,
    @Param('query') query: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sellerDocumentService.updateFiles(sellerId,query,res,file)
  }

  //// admin section starts form here /////

  @Get('/admin/getSellerDetails/:sellerId')
  @ApiOperation({ summary: 'Get Seller Details By Admin Route' })
  @UseGuards(AdminAuthGuard)
  getAdminSellerDetails(
    @Param('sellerId') sellerId: string,
    @Res() res: Response,
  ) {
    return this.sellerDocumentService.getSellerDetailsadmin(res, sellerId);
  }
}
