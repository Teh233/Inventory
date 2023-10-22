import {
  Controller,
  Post,
  Body,
  Res,
  Delete,
  Param,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import {
  DeleteBarcodeDto,
  DeleteBarcodeInBulkDto,
  GenerateBarcodeDto,
  ReturnBarcodeDto,
  globalBarcodeDto,
  verifyProductDto,
} from './dto/create-barcode.dto';
import { Response, Request } from 'express';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Barcode Api')
// @UseGuards(AdminAuthGuard)
@Controller('barcode')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Post('generate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'New Barcode Generate Route' })
  @ApiBody({
    type: GenerateBarcodeDto,
  })
  create(@Body() createBarcodeDto: GenerateBarcodeDto, @Res() res: Response) {
    return this.barcodeService.create(createBarcodeDto, res);
  }

  @Post('/getBarcode')
  // @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Download Barcode In Excel Route' })
  @ApiBody({
    type: GenerateBarcodeDto,
  })
  allBarcodeInExcel(@Body() allSkus: GenerateBarcodeDto, @Res() res: Response) {
    return this.barcodeService.allBarcodeInExcel(allSkus, res);
  }

  @Delete('/deleteBarcode')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete Barcode Route' })
  @ApiBody({
    type: DeleteBarcodeDto,
  })
  deleteBarcode(@Body() Sno: DeleteBarcodeDto, @Res() res: Response) {
    return this.barcodeService.deleteBarcode(Sno, res);
  }

  @Get('/getSerialNumber/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Barcode Of A Single SKU Route' })
  getAllBarcodeOfSingleSku(@Param('id') id: string, @Res() res: Response) {
    return this.barcodeService.getAllBarcodeOfSingleSku(id, res);
  }

  @Get('/getAllBarcodes')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Barcodes Route' })
  getAllBarcodes(@Res() res: Response) {
    return this.barcodeService.getAllBarcodes(res);
  }

  @Post('/dispatchBarcodeInBulk')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Dispatch Barcode In Bulk Or Single Route' })
  @ApiBody({
    type: DeleteBarcodeInBulkDto,
  })
  dispatchBarcodeInBulk(
    @Body() deleteBarcodes: DeleteBarcodeInBulkDto,
    @Res() res: Response,
  ) {
    return this.barcodeService.dispatchBarcodeInBulk(deleteBarcodes, res);
  }

  @Get('/getBarcodeHistory')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Dispatched Barcodes History Route' })
  getBarcodeHistory(@Res() res: Response) {
    return this.barcodeService.getBarcodeHistory(res);
  }

  @Post('/returnProduct')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Return Barcode Route' })
  @ApiBody({
    type: ReturnBarcodeDto,
  })
  returnBarcode(@Body() returnBacode: ReturnBarcodeDto, @Res() res: Response) {
    return this.barcodeService.returnBarcode(returnBacode, res);
  }

  @Get('/getreturnHistory')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Returned Barcodes History Route' })
  getAllReturnBarcodeHistory(@Res() res: Response) {
    return this.barcodeService.getAllReturnBarcodeHistory(res);
  }

  @Post('/verifySticky')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Verify(sticker) Barcode Route' })
  @ApiBody({
    type: verifyProductDto,
  })
  verifyProductBarcode(
    @Body() verifyProduct: verifyProductDto,
    @Res() res: Response,
  ) {
    return this.barcodeService.verifyProductBarcode(verifyProduct, res);
  }

  @Post('/verifyBarcodeForDispatch')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Check Barcode Before Dispatch Route' })
  @ApiBody({
    type: globalBarcodeDto,
  })
  verifyBarcodeForDispatch(
    @Body() searchProduct: globalBarcodeDto,
    @Res() res: Response,
  ) {
    return this.barcodeService.verifyBarcodeForDispatch(searchProduct, res);
  }

  @Post('/searchVerifySticky')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Check and Verify Barcode(sticker) Route' })
  @ApiBody({
    type: globalBarcodeDto,
  })
  searchBarcodeForVerifyProduct(
    @Body() searchProduct: globalBarcodeDto,
    @Res() res: Response,
  ) {
    return this.barcodeService.searchBarcodeForVerifyProduct(
      searchProduct,
      res,
    );
  }

  @Post('/verifyBarcodeForReturn')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Check Barcode Before Return Route' })
  @ApiBody({
    type: globalBarcodeDto,
  })
  verifyBarcodeForReturn(
    @Body() searchProduct: globalBarcodeDto,
    @Res() res: Response,
  ) {
    return this.barcodeService.verifyBarcodeForReturn(searchProduct, res);
  }

  @Post('/barcodeForRejection')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Reject Barcode Route' })
  barcodeForRejection(@Body() body: any, @Res() res: Response) {
    return this.barcodeService.barcodeForRejection(body, res);
  }

  @Post('/addSubCategory')
  @UseGuards(AdminAuthGuard)
  addSubCategory(@Req() req: Request, @Res() res: Response) {
    return this.barcodeService.addSubCategory(req, res);
  }

  // get products by sku
  @Post('/getProducts')
  @UseGuards(AdminAuthGuard)
  getProductwithBarcode(@Req() req: Request, @Res() res: Response) {
    return this.barcodeService.getProductWithBarcode(req, res);
  }

  @Get('/salesHistory')
  @UseGuards(AdminAuthGuard)
  getSalesHistory(@Res() res: Response) {
    return this.barcodeService.getSalesHistory(res);
  }

  @Get('/salesHistory/:id')
  @UseGuards(AdminAuthGuard)
  getSingleSalesHistory(@Param('id') id: string, @Res() res: Response) {
    return this.barcodeService.getSingleSalesHistory(id, res);
  }

  @Post('/addCustomer')
  addCustomer(@Res() res: Response, @Body() body: any) {
    return this.barcodeService.addCustomer(res, body);
  }

  @Get('/getAllCustomer')
  getAllCustomer(@Res() res: Response) {
    return this.barcodeService.getAllCustomer(res);
  }
  @Get('/getSingleCustomer/:id')
  getSingleCustomer(@Param('id') id: string, @Res() res: Response) {
    return this.barcodeService.getSingleCustomer(id, res);
  }
}
