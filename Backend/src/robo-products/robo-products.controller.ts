import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  Res,
  Req,
  Put,
  Body,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import { SellerAuthGuard } from 'src/auth/guards/seller-auth.guard';
import { RoboProductsService } from './robo-products.service';
import {
  UpdateOneRoboProductDto,
  addProducutBulkDto,
} from './dto/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Brand } from './schema/brand.schema';

@ApiTags('RoboProducts Api')
@Controller('robo-products')
export class RoboProductsController {
  constructor(private readonly roboProductService: RoboProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All RoboProducts Route' })
  @UseGuards(SellerAuthGuard)
  findAll(@Res() res: Response, @Query() query: any) {
    return this.roboProductService.findAll(res, query);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Get All Products Name And SKU Route' })
  @UseGuards(SellerAuthGuard)
  searchByString(@Res() res: Response) {
    // console.log(filters)
    return this.roboProductService.sellerSearch(res);
  }

  @Get('oneProduct/:id')
  @ApiOperation({ summary: 'Get Single Product By Id Route' })
  @UseGuards(SellerAuthGuard)
  getOneProduct(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    return this.roboProductService.getOneProduct(id, res);
  }

  @Get('/searchIndex')
  searchIndex(@Res() res: Response, @Query() filters?: any) {
    return this.roboProductService.searchIndex(res, filters);
  }

  @Get('/indexAutoComplete')
  indexAutoComplete(@Res() res: Response, @Query() filters?: any) {
    return this.roboProductService.indexAutoComplete(res, filters);
  }

  //// admin section starts form here /////

  @Post('/admin/addRoboProduct')
  @ApiOperation({ summary: 'Add RoboProducts For Admin Route' })
  @UseGuards(AdminAuthGuard)
  addRoboProduct(
    @Body() addRoboProduct: addProducutBulkDto,
    @Res() res: Response,
  ) {
    return this.roboProductService.addRoboProduct(addRoboProduct, res);
  }

  @Put('/admin/updateOneRoboProduct/:id')
  @ApiOperation({ summary: ' Update Single RoboProduct By Admin Route' })
  @UseGuards(AdminAuthGuard)
  updateOneRoboProduct(
    @Param('id') id: string,
    @Body() updateOneRoboProduct: UpdateOneRoboProductDto,
    @Res() res: Response,
  ) {
    return this.roboProductService.updateOneRoboProduct(
      id,
      updateOneRoboProduct,
      res,
    );
  }

  // get all products
  @Get('/admin/allProducts')
  @ApiOperation({ summary: 'Get All Product By Admin Route' })
  @UseGuards(AdminAuthGuard)
  findAllProducts(@Res() res: Response, @Query() filters?: any) {
    return this.roboProductService.findAllProducts(res, filters);
  }

  // update  all products
  @Put('/admin/updateProducts')
  @ApiOperation({ summary: 'Update Products By Admin Route' })
  @UseGuards(AdminAuthGuard)
  updateProducts(
    @Query('query') query: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.updateProducts(query, res, req);
  }

  // Aprrove  all products
  @Put('/admin/approveAllProducts')
  @ApiOperation({ summary: 'Approve All Products By Admin Route' })
  @UseGuards(AdminAuthGuard)
  updateApproval(
    @Query('query') query: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.updateApproval(query, res, req);
  }

  // Aprrove  all products
  @Get('/admin/getUnApprovedProducts')
  @ApiOperation({ summary: 'Get All UnApproved Products By Admin Route' })
  @UseGuards(AdminAuthGuard)
  getUnApprovedProduct(@Query('query') query: string, @Res() res: Response) {
    return this.roboProductService.getUnApprovedProduct(query, res);
  }

  // update Notation of product
  @Put('/admin/updateNotation/:id')
  @ApiOperation({ summary: 'Update Single Product Notation Route' })
  @UseGuards(AdminAuthGuard)
  updateNotation(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.roboProductService.updateNotation(id, req, res);
  }

  // get Single Product History
  @Get('/admin/getProductHistory/:id')
  @ApiOperation({ summary: 'Get Single Product History Route' })
  @UseGuards(AdminAuthGuard)
  getProductHistory(@Param('id') id: string, @Res() res: Response) {
    return this.roboProductService.getProductHistory(id, res);
  }

  // all products search for admin
  @Get('/admin/search')
  @ApiOperation({ summary: 'Get All Products Name And SKU By Admin Route' })
  @UseGuards(AdminAuthGuard)
  searchProduct(@Res() res: Response) {
    return this.roboProductService.searchProduct(res);
  }

  // get single product for admin by sku
  @Get('/admin/oneProduct/:sku')
  @ApiOperation({ summary: 'Get Single Product By Admin Route' })
  @UseGuards(AdminAuthGuard)
  getSingleProrduct(@Param('sku') sku: string, @Res() res: Response) {
    return this.roboProductService.getSingleProrduct(sku, res);
  }

  // Upload five side images for admin by SKU
  @Post('/admin/uploadMultiImages/:sku')
  @ApiOperation({ summary: 'Upload Multiple Images By Admin Route' })
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'Images', maxCount: 5 }])) // Set maxCount to 5
  uploadMultipleImages(
    @UploadedFiles() files: { Images?: Express.Multer.File[] }, // Use the 'Images' field name
    @Param('sku') sku: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(files);
    return this.roboProductService.uploadMultipleImages(sku, res, files, req);
  }

  // delete Side Images
  @Delete('/admin/deleteImage/:sku')
  @ApiOperation({ summary: 'Delete Images By Admin Route' })
  @UseGuards(AdminAuthGuard)
  deleteSideImage(
    @Param('sku') sku: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.deleteSideImage(sku, res, req);
  }

  // get Product Status in Excel
  @Post('/admin/ProductStatusExcel')
  @ApiOperation({ summary: 'Download Product Status In Excel By Admin Route' })
  //  @UseGuards(AdminAuthGuard)
  getProductStatusExcel(@Req() req: Request, @Res() res: Response) {
    return this.roboProductService.getProductStatusExcel(req, res);
  }

  @Post('/admin/makeDefaultImage/:sku')
  @ApiOperation({ summary: 'Make Default Image By Admin Route' })
  @UseGuards(AdminAuthGuard)
  makeDefaultImage(
    @Param('sku') sku: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.makeDefaultImage(sku, res, req);
  }

  @Get('/admin/productApprovalCount')
  @ApiOperation({ summary: 'Get Product Approval Count By Admin Route' })
  @UseGuards(AdminAuthGuard)
  productApprovalCount(@Res() res: Response, @Req() req: Request) {
    return this.roboProductService.productApprovalCount(res, req);
  }

  // brand related

  @Post('/admin/addBrand')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'Images', maxCount: 2 }])) // Set maxCount to 5
  createBrand(
    @UploadedFiles() files: { Images?: Express.Multer.File[] },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.addBrand(files, res, req);
  }

  @Get('/admin/getAllBrand')
  getBrand(@Res() res: Response) {
    return this.roboProductService.getBrand(res);
  }

  @Put('/admin/updateBrand')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'Images', maxCount: 2 }]))
  updateBrand(
    @UploadedFiles() files: { Images?: Express.Multer.File[] },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.roboProductService.updateBrand(files, res, req);
  }

  @Delete('/admin/deleteBrand/:id')
  deleteBrand(@Param('id') id: string, @Res() res: Response) {
    return this.roboProductService.deleteBrand(id, res);
  }

  @Get('/admin/indexAutoComplete')
  indexAutoCompleteAdmin(@Res() res: Response, @Query() filters?: any) {
    return this.roboProductService.indexAutoCompleteAdmin(res, filters);
  }

  /// Calc Controller
  @Post('/admin/addCalc')
  addCalc(@Res() res: Response, @Req() req: Request) {
    return this.roboProductService.addCalc(req, res);
  }

  @Get('/admin/getCalc')
  getCalc(@Res() res: Response, @Req() req: Request) {
    return this.roboProductService.getCalc(req, res);
  }

  @Get('/admin/getCalcById/:id')
  getCalcById(@Res() res: Response, @Param('id') id: string) {
    console.log('trigger');
    return this.roboProductService.getCalcById(id, res);
  }

  @Put('/admin/updateCalcById/:id')
  updateCalcById(
    @Res() res: Response,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.roboProductService.updateCalcById(id, res, req);
  }
}
