import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreatePricesHistoryDto,
} from './dto/create-prices-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PricesHistory } from './schema/prices-history.schema';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class PricesHistoryService {
  constructor(
    @InjectModel(PricesHistory.name)
    private PriceHistoryModel: Model<PricesHistory>,
  ) {}

  async createPriceHistory(
    createPricesHistoryDto: CreatePricesHistoryDto[],
    res,
  ) {
    try {
    
      if (
        !Array.isArray(createPricesHistoryDto) ||
        createPricesHistoryDto.length === 0
      ) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Please provide valid price history data',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const result = [];
      for (const data of createPricesHistoryDto) {
        const { SKU, priceHistory } = data;

        if (!Array.isArray(priceHistory) || priceHistory.length === 0 || !SKU) {
          throw new HttpException(
            {
              status: 'error',
              message: 'Please provide valid price history data or SKU',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        // Set the default date for each price history entry
        const priceHistoryWithDefaultDate = priceHistory.map((entry) => ({
          ...entry,
          Date: new Date(),
        }));

        let existingPricesHistory = await this.PriceHistoryModel.findOne({
          SKU,
        });

        if (!existingPricesHistory) {
          const newPricesHistory = new this.PriceHistoryModel({
            SKU,
            PriceHistory: priceHistoryWithDefaultDate,
          });
          existingPricesHistory = await newPricesHistory.save();
        } else {
          existingPricesHistory.PriceHistory.push(
            ...priceHistoryWithDefaultDate,
          );
          existingPricesHistory = await existingPricesHistory.save();
        }

        result.push({
          SKU,
          message: 'Price History successfully created/updated',
          data: existingPricesHistory,
        });
      }

      res.status(201).send({
        status: 'success',
        message: 'Price History successfully updated',
        data: result,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOnePriceHistory(sku:string, res:Response) {
    try {
      if (!sku) {
        throw new HttpException(
          { message: 'SKU is required' },
          HttpStatus.NOT_FOUND,
        );
      }
      const priceHistory = await this.PriceHistoryModel.findOne({
        SKU: sku,
      }).sort({ Date: -1 });
    
      res.status(200).send({ status: 'success', data: priceHistory });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllPriceHistory(res:Response) {
    try {
      const allPriceHistory = await this.PriceHistoryModel.find({}).sort({updatedAt:-1});
      res.send({
        status: 'success',
        message: 'All Price History successfully fetched',
        data: allPriceHistory,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
