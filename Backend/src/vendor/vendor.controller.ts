import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';
import { Response } from 'express';
import { ApiResponse, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Vendor Api")
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('/admin/getAll')
  @ApiOperation({ summary: 'Get All Vendor Route' })
  @UseGuards(AdminAuthGuard)
  async findAll(@Res() res: Response) {
    return this.vendorService.findAll(res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Single Vendor Route' })
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }
}
