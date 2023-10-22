import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddBoxesDto, CreateLogisticDto } from './dto/create-logistic.dto';
import { generateRandomNumber } from 'src/common/utils/common.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Box, Logistic } from './schema/logistic.schema';
import { Model } from 'mongoose';

var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_JrmYS9LlAdCUKrwBc9FtN2QBKiA=',
  privateKey: 'private_5rRWktPKtZZZ/2xTtMAO6Dy3dAU=',
  urlEndpoint: 'https://ik.imagekit.io/exbyhpjtw',
});

@Injectable()
export class LogisticsService {
  constructor(
    @InjectModel(Logistic.name) private readonly LogisticModel: Model<Logistic>,
  ) {}

  // add or create a new logistics
  async createLogistic(createLogisticDto: CreateLogisticDto, res) {
  
    try {
      const { HAWB, PI, CI, Box, CourierType,LogisticDate } = createLogisticDto;
      console.log(createLogisticDto)
      const logisticId = `LOG${generateRandomNumber(6)}`;
      const createLogistic = {
        logisticId: logisticId,
        // Date: Date.now,
        Hawb: HAWB,
        Pi: PI,
        Ci: CI,
        Box: Box,
        CourierType: CourierType,
        Note: 'inOffice',
        LogisticDate:LogisticDate
      };
      const logistic = await this.LogisticModel.create(createLogistic);
      res.status(201).send({
        status: 'success',
        message: 'Logistic created Successfully',
        data: logistic,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // add boxes in existing logistics
  async addBoxes(
    files: {
      photo?: Express.Multer.File[];
    },
    id: string,
    addBoxesDto: AddBoxesDto,
    res,
  ) {
    try {
      const { weight, height, width, length, actWeight, marking, description } =
        addBoxesDto;

      if (!weight || !height || !width || !length || !actWeight) {
        return res
          .status(400)
          .send({ message: 'Please fill all required fields' });
      }

      const logistic = await this.LogisticModel.findOne({ logisticId: id });
      if (!logistic) {
        return res.status(404).json({ message: 'Logistic not found' });
      }

      const data: Box = {
        weight: weight,
        height: height,
        width: width,
        length: length,
        actWeight: actWeight,
        marking: marking,
        description: description,
      };

      if (files.photo && files.photo.length > 0) {
        const filePath = `/${Date.now()}/${id}/${files.photo[0].originalname}`;
        const folderPath = `${process.env.IMAGEKIT_FOLDER}/LogisticBox/${id}`;

        const uploadResponse = await imagekit.upload({
          file: files.photo[0].buffer,
          fileName: filePath,
          folder: folderPath,
        });

        data.photo = uploadResponse.url;
      }

      const NoOfBox = logistic.NoOfBox;
      NoOfBox.push(data);
      logistic.Note = 'submit';
      await logistic.save();

      return res.status(200).json({
        status: 'success',
        message: 'Boxes added successfully',
        data: logistic,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all logistic data
  async getAllLogistics(res) {
    try {
      const logistics = await this.LogisticModel.find({}).sort({Date:-1})
      res.status(200).send({
        status: 'success',
        message: 'All Logistices fetched successfully',
        data: logistics,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get a single logistic using logistic id
  async getSingleLogistic(id: string, res) {
    try {
      const logistic = await this.LogisticModel.findOne({ logisticId: id });
      res.status(200).send({
        message: 'Logistic fetched succesfully',
        data: logistic,
        status: 'success',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
