import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { Vendor, ClientUser } from './schema/vendor.schema';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>,

    @InjectModel(ClientUser.name)
    private clientUserModel: Model<ClientUser>,
  ) {}

  // get All Vendor
  async findAll(res: Response) {
    try {
      const vendor = await this.vendorModel.find({ isClient: true });

      if (vendor.length === 0) {
        return res.status(204).send({
          status: 'success',
          message: 'No vendor found',
        });
      }
      res.send({
        status: 'success',
        message: 'All Vendor successfully fetched',
        data: vendor,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }
}
