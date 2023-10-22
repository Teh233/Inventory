import {
  Controller,
  Post,
  Body,
  Res,
  ValidationPipe,
  UploadedFiles,
  Get,
  Req,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RestockService } from './restock.service';
import {
  CreatePriceComparisionDto,
  CreateRestockRequestDto,
  UpdatePriceRequestDto,
} from './dto/create-restock.dto';
import { Restock } from './schema/restock.schema';
import { Request, Response } from 'express';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Retocks Api")
@Controller('restock')
export class RestockController {
  constructor(private readonly restockService: RestockService) {}

  @Post('admin/create')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create Restock Route' })
  async createRestock(
    @Body(ValidationPipe) createRestockDtos: CreateRestockRequestDto,
    @Res() res: Response,
  ): Promise<Restock> {
    const restock = await this.restockService.createRestock(
      createRestockDtos,
      res,
    );
    return restock;
  }

  // get all restock for oversease order with some criteria
  @Get('admin/getAll')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Restock Route' })
  async getAllRestock(@Res() res: Response) {
    const restock = await this.restockService.getAllRestock(res);
    return restock;
  }

  // get single restock product
  @Get('admin/getRestock/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get Single Restock Route' })
  async getSingleRestockProduct(@Param('id') id: string, @Res() res: Response) {
    return await this.restockService.getSingleRestockProduct(id, res);
  }

  // create overseas order
  @Post('admin/createOverseasOrder')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create Oversease Order Route' })
  async createOverseasOrder(@Req() req: Request, @Res() res: Response) {
    return await this.restockService.createOverseasOrder(req, res);
  }

  // get All overseas order
  @Get('admin/getAllOverseasOrder')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get All Oversease Order Route' })
  async getAllOverseasOrder(@Res() res: Response) {
    return await this.restockService.getAllOverseasOrder(res);
  }

  // get One overseas order
  @Get('admin/getOneOverseasOrder/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Get Single Oversease Order Route' })
  async getSingleOverseasOrder(@Req() req: Request, @Res() res: Response) {
    return await this.restockService.getSingleOverseasOrder(req, res);
  }

  // update Order Quantity
  @Put('admin/updateOrderQuantity/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Update Order Quantity Route' })
  async updateOrderQuantity(@Req() req: Request, @Res() res: Response) {
    return await this.restockService.updateOrderQuantity(req, res);
  }

  // update Order Quantity
  @Delete('admin/deleteOrderItem/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Delete Single Order Queantity Route' })
  async deleteOrderItem(@Req() req: Request, @Res() res: Response) {
    return await this.restockService.deleteOrderItem(req, res);
  }

  // update Required Quantity and Price
  @Put('admin/updateColumn/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'To Update Required Quantity Route' })
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Query('type') type: string,
    @Param('id') id: string,
  ) {
    return await this.restockService.updateRequireQtyAndPrice(
      req,
      res,
      type,
      id,
    );
  }

  // get single vendor
  @Get('/admin/getOverseasByVendor/:id')
  @ApiOperation({ summary: 'To get Single Oversease Order By Vendor Route' })
  async getOverseasByVendor(@Param('id') id: string, @Res() res: Response) {
    return this.restockService.getOverseasByVendor(id, res);
  }

  // Download PI
  @Get('/admin/PIDownload/:id')
  @ApiOperation({ summary: 'Download Pi In Excel Route' })
  async downloadPIPDF(@Param('id') id: string, @Res() res: Response) {
    return this.restockService.downloadPIPDF(id, res);
  }

  // upload Overseas order Payment Reciept
  @Post('/admin/uploadReciept/:id')
  @ApiOperation({ summary: 'To Uploade Receipt By Admin Route' })
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'reciept', maxCount: 1 }])) // Set maxCount to 5
  uploadOverseasOrderReciept(
    @UploadedFiles() files: { reciept?: Express.Multer.File[] }, // Use the 'Images' field name
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.restockService.uploadOverseasOrderReciept(id, res, files, req);
  }

  @Post('/admin/assignOrder')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Assign Order By Admin Route' })
  async assignOrder(@Req() req: Request, @Res() res: Response) {
    return this.restockService.assignOrder(req, res);
  }

  @Post('/admin/addPriceVendor')
  // @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Add Price For Vendor By Admin Route' })
  async addPriceForVendor(
    @Body() vendorPrice: UpdatePriceRequestDto,
    @Res() res: Response,
  ) {
    return this.restockService.addPriceForVendor(vendorPrice, res);
  }
  @Post('/admin/getOnePriceCompareVendor')
  // @UseGuards(AdminAuthGuard)
  async getPriceComparison(@Req() req:Request, @Res() res: Response) {
    return this.restockService.getOnePriceCompareVendor(req, res);
  }

  @Get('/admin/priceCompareVendor/:id')
  // @UseGuards(AdminAuthGuard)
  async getPriceCompareVendor(@Param('id') id: string, @Res() res: Response) {
    return this.restockService.getPriceCompareVendor(id, res);
  }

  @Get('/admin/getOrderById/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get Single Order By Admin Route' })
  async getOverseaseOrder(@Param('id') id: string, @Res() res: Response) {
    return this.restockService.getOverseaseOrder(id, res);
  }

  @Post('/admin/createPriceComparision')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({summary: " To Create price comparision By Admin Route"})
  async createPriceComparison(@Body() createPriceComparisionDto:CreatePriceComparisionDto, @Res() res:Response){
    return this.restockService.createPriceComparision(createPriceComparisionDto,res)
  }

  @Get('/admin/getPriceComparision')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({summary: " To Get Price Comparision By Admin Route"})
  async getPriceComparision( @Res() res:Response){
    return this.restockService.getPriceComparision(res)
  }

  @Get('/admin/getPriceComparision/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({summary: " To Get Price Comparision By Admin Route"})
  async getSinglePriceComaprarision(@Param('id')  id:string, @Res() res:Response){
    return this.restockService.getSinglePriceComaprarision(id,res)
  }
}
