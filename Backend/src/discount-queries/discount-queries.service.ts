import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateDiscountQueryDto,
  UpdateDiscountQueryDto,
} from './dto/create-discount-query.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountQuery } from './schema/discount-query.schema';
import { Model } from 'mongoose';
import { generateRandomNumber } from 'src/common/utils/common.utils';
import { Response } from 'express';
import { roboproducts } from 'src/robo-products/schema/robo-products.schema';

@Injectable()
export class DiscountQueriesService {
  constructor(
    @InjectModel(DiscountQuery.name)
    private DiscountQueryModel: Model<DiscountQuery>,
    @InjectModel(roboproducts.name)
    private RoboProductModel: Model<roboproducts>,
  ) {}

  // create a new discount query
  async addDiscountQuery(
    createDiscountQueryDto: CreateDiscountQueryDto,
    res: Response,
  ) {
    try {
      const { CustomerName, MobileNo, Data, Message, status } =
        createDiscountQueryDto;
      const QueryId = `QID${generateRandomNumber(6)}`;
      const newQuery = {
        QueryId: QueryId,
        CustomerName: CustomerName,
        MobileNo: MobileNo,
        Data: Data,
        message: Message,
        status: status,
      };

      const query = await this.DiscountQueryModel.create(newQuery);

      res.send({
        status: 'success',
        message: 'New Discout Query Added Successfully',
        Query: query,
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all discount queries
  async getDisountQuery(res: Response) {
    try {
      const query = await this.DiscountQueryModel.find({}).sort({
        createdAt: -1,
      });

    

      const newQueryData = query.map((element) => {
        const subtotal = element.Data.reduce(
          (acc, item: any) => acc + item.totalPrice,
          0,
        );
        return { ...element.toObject(), subtotal };
      });

    

      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Disount Query Successfully fetched',
        data: newQueryData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get single discount query
  async getSingleDiscountQuery(Queryid: string, type: string, res: Response) {
    try {
      if (!Queryid) {
        throw new BadRequestException('Queryid is required');
      }

      const discountQuery: any = await this.DiscountQueryModel.findOne({
        QueryId: Queryid,
      });

      if (!discountQuery) {
        throw new BadRequestException(
          'DiscountQuery not found. Please provide a valid queryid',
        );
      }

      const calculateTotalDiscountPrice = (item: any) =>
        item?.reqQty * item?.discountPrice || 0;
      const calculateTotalSalesPrice = (item: any) =>
        item?.reqQty * item?.SalesPrice || 0;

      const discontsQueries = discountQuery.Data.map((item: any) => ({
        ...item,
        TotalDiscountPrice: calculateTotalDiscountPrice(item),
        TotalSalesPrice: calculateTotalSalesPrice(item),
      }));

      const overallTotalSalesPrice = discontsQueries.reduce(
        (total: number, item: any) => total + item.TotalSalesPrice,
        0,
      );

      const overallTotalDiscountPrice = discontsQueries.reduce(
        (total: number, item: any) => total + item.TotalDiscountPrice,
        0,
      );

      const oldDiscount = overallTotalSalesPrice - overallTotalDiscountPrice;

      const datas = {
        discontsQueries,
        NewOfferData:discountQuery.NewOfferData,
        CustomerName: discountQuery.CustomerName,
        MobileNo: discountQuery.MobileNo,
        status: discountQuery.status,
        Message: discountQuery.message || 'No Message Available',
        TotalSalesPrice: overallTotalSalesPrice,
        PreviousTotal: overallTotalDiscountPrice,
        OldDiscount: oldDiscount,
        AfterDiscountTotalProfit:discountQuery.AfterDiscountTotalProfit,
        date:discountQuery.createdAt
        
      };

      if (type === 'admin') {
        const skus = discountQuery.Data.map((item: any) => item.SKU);
        const roboproducts = await this.RoboProductModel.find({
          SKU: { $in: skus },
        });
  
        const landingCosts: any = new Map(
          roboproducts.map((product) => [product.SKU, product.LandingCost]),
        );
        const SalesTax: any = new Map(
          roboproducts.map((product) => [product.SKU, product.SalesTax]),
        );
        
         const discountQueryWithLandingCosts = discountQuery.Data.map((data: any) => ({
          ...data,
          TotalDiscountPrice: calculateTotalDiscountPrice(data),
          landingCost: landingCosts.get(data.SKU),
          TotalLandingCost: data.reqQty * landingCosts.get(data.SKU),
          prevProfit: ((data.discountPrice - landingCosts.get(data.SKU)) * 100) / landingCosts.get(data.SKU),
          SalesTax:SalesTax.get(data.SKU),
        }));
  
        const overallTotalLandingCost = discountQueryWithLandingCosts.reduce(
          (total: number, item: any) => total + item.TotalLandingCost,
          0,
        );
        const overallTotalPrevProfit = (overallTotalDiscountPrice - overallTotalLandingCost)*100/overallTotalLandingCost
  
        const adminDatas = {
          discountQueryWithLandingCosts,
          NewOfferData:discountQuery.NewOfferData,
          CustomerName: discountQuery.CustomerName,
          MobileNo: discountQuery.MobileNo,
          Message: discountQuery.message || 'No Message Available',
          TotalSalesPrice: overallTotalSalesPrice,
          PreviousTotal: overallTotalDiscountPrice,
          OldDiscount: oldDiscount,
          TotalLandingCost: overallTotalLandingCost,
          TotalPrevProfit: overallTotalPrevProfit.toFixed(0),
          CurentTotalProfit:discountQuery.CurentTotalProfit,
          AfterDiscountTotalProfit:discountQuery.AfterDiscountTotalProfit,
          date:discountQuery.createdAt
        };
  
        res.status(HttpStatus.OK).send({
          status: 'success',
          message: 'Discount Query Successfully fetched for admin',
          data: adminDatas,
        });
      } else {
        res.status(HttpStatus.OK).send({
          status: 'success',
          message: 'Discount Query Successfully fetched',
          data: datas,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update discount query
  async updateDiscountQuery(
    QueryId: string,
    type: string,
    UpdateDiscountQueryDto: UpdateDiscountQueryDto,
    res: Response,
  ) {
    try {
      const { NewOfferData ,CurentTotalProfit,AfterDiscountTotalProfit} = UpdateDiscountQueryDto;
      const discountQuery = await this.DiscountQueryModel.findOne({
        QueryId: QueryId,
      });
      if (!QueryId) {
        throw new BadRequestException('QueryId is required');
      }
      if (!discountQuery) {
        return res.status(404).send('Discount query not found');
      }
      if (discountQuery.status === 'close') {
        return res.status(404).send('query has closed');
      }
      if (type === 'admin') {
        if (discountQuery.NewOffer === true) {
          return res.status(404).send('query already submitted');
        }
        if (NewOfferData.length === 0) {
          return res.status(400).send('NewOfferData is mandatory');
        }
        discountQuery.NewOfferData = NewOfferData;
        discountQuery.CurentTotalProfit = CurentTotalProfit;
        discountQuery.AfterDiscountTotalProfit= AfterDiscountTotalProfit;
        discountQuery.NewOffer = true;
        discountQuery.status = 'newOffer';
        const updatedQuery = await discountQuery.save();
        return res
          .status(200)
          .send({ status: 'success', updatedQuery: updatedQuery });
      }
      if (type === 'sold') {
        discountQuery.status = 'sold';
        const updatedQuery = await discountQuery.save();
        return res.status(200).send({message:'Query successfully accepted',status:"success"});
      }
      if (type === 'close') {
        discountQuery.status = 'close';
        const updatedQuery = await discountQuery.save();
        return res.status(200).send({message:'Query successfully closed',status:"success"});
      }
      res.status(400).send({message:'Invalid Query',status:"error"});
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
