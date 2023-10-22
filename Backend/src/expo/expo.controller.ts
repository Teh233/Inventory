import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpoService } from './expo.service';
import { CreateExpoDto } from './dto/create-expo.dto';
import { UpdateExpoDto } from './dto/update-expo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
@Controller('expo')
export class ExpoController {
  constructor(private readonly expoService: ExpoService) {}

  @Post('/create')
  create(@Body() createExpoDto: CreateExpoDto, @Res() res: Response) {
    return this.expoService.create(createExpoDto, res);
  }

  @Post('/addInvitee')
  async add(@Body() body: any, @Res() res: Response) {
    return await this.expoService.add(body, res);
  }

  @Post('/addFile')
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.expoService.addFile(res, file);
  }

  @Get('/getAllCompany')
  getAllCompany(@Res() res: Response) {
    return this.expoService.getAllCompany(res);
  }
}
