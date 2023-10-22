import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { AddBoxesDto, CreateLogisticDto } from './dto/create-logistic.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';

@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('/addLogistic')
  createLogistic(
    @Body() createLogisticDto: CreateLogisticDto,
    @Res() res: Response,
  ) {
    return this.logisticsService.createLogistic(createLogisticDto, res);
  }

  @Post('/addBoxes/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  addBoxes(
    @UploadedFiles()
    files: {
      photo: Express.Multer.File[];
    },
    @Param('id') id: string,
    @Body() addBoxesDto: AddBoxesDto,
    @Res() res: Response,
  ) {
    return this.logisticsService.addBoxes(files, id, addBoxesDto, res);
  }

  @Get('/getallLogistics')
  getAllLogistics(@Res() res: Response) {
    return this.logisticsService.getAllLogistics(res);
  }

  @Get('/getLogistic/:id')
  getSingleLogistic(@Param('id') id: string, @Res() res: Response) {
    return this.logisticsService.getSingleLogistic(id, res);
  }
}
