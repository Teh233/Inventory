import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PriceComparision, Restock } from './schema/restock.schema';
import { OverseasOrder } from './schema/restock.schema';
import { Vendor, ClientUser } from 'src/vendor/schema/vendor.schema';
import {
  CreatePriceComparisionDto,
  CreateRestockRequestDto,
  UpdatePriceRequestDto,
} from './dto/create-restock.dto';
var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_JrmYS9LlAdCUKrwBc9FtN2QBKiA=',
  privateKey: 'private_5rRWktPKtZZZ/2xTtMAO6Dy3dAU=',
  urlEndpoint: 'https://ik.imagekit.io/exbyhpjtw',
});
import {
  generateRandomNumber,
  PI_PDF_Generator,
} from 'src/common/utils/common.utils';
import { Request, Response } from 'express';

@Injectable()
export class RestockService {
  constructor(
    @InjectModel(Restock.name) private readonly restockModel: Model<Restock>,

    @InjectModel(OverseasOrder.name)
    private readonly overseasOrderModel: Model<OverseasOrder>,

    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>,

    @InjectModel(PriceComparision.name)
    private priceComparisionModel: Model<PriceComparision>,

    @InjectModel(ClientUser.name)
    private clientUserModel: Model<ClientUser>,
  ) {}

  async createRestock(
    createRestockDtos: CreateRestockRequestDto,
    res: any,
  ): Promise<Restock> {
    try {
      const { restocks } = createRestockDtos;

      if (!Array.isArray(restocks) || restocks.length === 0) {
        throw new BadRequestException(
          'At least one restock object is required',
        );
      }

      const invalidObjects = restocks.filter(
        (dto) => !dto.SKU || !dto.Name || !dto.NewQuantity,
      );

      if (invalidObjects.length > 0) {
        throw new BadRequestException('All fields are required');
      }

      const restockId = `RS${generateRandomNumber(6)}`;
      const products = restocks.map((dto) => ({
        SKU: dto.SKU,
        Name: dto.Name,
        Brand: dto.Brand,
        Category: dto.Category,
        NewQuantity: dto.NewQuantity,
        ThresholdQty: dto.ThresholdQty,
        Quantity: dto.Quantity,
      }));

      // console.log(products);
      const restock = await this.restockModel.create({
        restockId,
        products,
      });

      return res.status(201).send({
        status: 'success',
        message: 'Restock successfully created',
        data: restock,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllRestock(res) {
    try {
      const allRestock = await this.restockModel.find({});

      const restockData = allRestock.map((restock: any) => {
        // Calculate the count of products with each status
        const statusCounts = restock.products.reduce(
          (counts, product) => {
            counts[product.Status]++;
            return counts;
          },
          { generated: 0, processing: 0, paid: 0 },
        );
        // Extract relevant information for each restock
        return {
          restockId: restock.restockId,
          totalProducts: restock.products.length,
          totalProductGenerated: statusCounts.generated,
          totalProductInProcess: statusCounts.processing,
          totalProductPaid: statusCounts.paid,
          createdAt: restock.createdAt,
          updatedAt: restock.updatedAt,
          status: restock.status,
          isAssigned: restock.isAssigned,
        };
      });

      res.status(200).send({
        status: 'success',
        message: 'All Restocks successfully found',
        restock: restockData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSingleRestockProduct(id, res) {
    try {
      if (!id) {
        throw new BadRequestException('Id is required');
      }
      const restock = await this.restockModel.findOne({ restockId: id });
      if (!restock) {
        throw new BadRequestException('Restock not found');
      }

      res.status(200).send({
        status: 'success',
        message: 'Product successfully found',
        product: restock,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createOverseasOrder(req: Request, res: Response) {
    try {
      const overSeasOrderId = `OV${generateRandomNumber(6)}`;
      const { products } = req.body;
      const newProducts = products.map((item) => {
        if (item.Status === 'processing' || item.Status === 'paid') {
          return res.status(404).send({
            status: 'error',
            message:
              'some product in list already in processsing or paid state',
          });
        }
        return { ...item, Status: 'processing' };
      });

      const newOverseasOrder = await this.overseasOrderModel.create({
        ...req.body,
        products: newProducts,
        overSeasOrderId: overSeasOrderId,
      });

      if (
        newOverseasOrder &&
        newOverseasOrder.products &&
        newOverseasOrder.products.length > 0
      ) {
        const restock = await this.restockModel.findOne({
          restockId: newOverseasOrder.restockId,
        });
        if (!restock) {
          throw new Error('Restock not found');
        }

        newOverseasOrder.products.forEach((item) => {
          const productIndex = restock.products.findIndex(
            (product) => product.SKU === item.SKU,
          );

          restock.products[productIndex].Status = 'processing';
        });
        await restock.save();
      }

      return res.send(newOverseasOrder);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllOverseasOrder(res: Response) {
    try {
      const allOverseasOrder = await this.overseasOrderModel.find({});
      const modifiedOverseasOrder = [];

      for (const order of allOverseasOrder) {
        const vendor = await this.vendorModel.findOne({
          VendorId: order.VendorId,
        });
        // console.log(vendor);

        const modifiedData = {
          ...order['_doc'],
          CompanyName: vendor.CompanyName,
          ConcernPerson: vendor.ConcernPerson,
          Mobile: vendor.Mobile,
        };
        modifiedOverseasOrder.push(modifiedData);
      }

      res.status(200).send({
        status: 'success',
        message: 'overseas order successfully fetched',
        AllOverSeasData: modifiedOverseasOrder,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSingleOverseasOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const order = await this.overseasOrderModel.findById(orderId);
      const vendor = await this.vendorModel.findOne({
        VendorId: order.VendorId,
      });

      const modifiedData = {
        ...order['_doc'],
        CompanyName: vendor.CompanyName,
        ConcernPerson: vendor.ConcernPerson,
        Mobile: vendor.Mobile,
      };

      res.status(200).send({
        status: 'success',
        message: 'single overseas order successfully fetched',
        data: modifiedData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateOrderQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newProductQuantity } = req.body;
      const order = await this.overseasOrderModel.findById(id);

      if (!order) {
        return res.status(404).send({
          status: 'error',
          message: 'Overseas order not found',
        });
      }
      const restockOrder = await this.restockModel.findOne({
        restockId: order.restockId,
      });

      if (!restockOrder) {
        return res.status(404).send({
          status: 'error',
          message: 'thier is no Restock order Associated with this order',
        });
      }
      order.products.forEach((product) => {
        const updatedProduct = newProductQuantity.find(
          (data) => data.SKU === product.SKU,
        );
        if (updatedProduct) {
          product.NewQuantity = updatedProduct.NewQuantity;
        }
      });

      restockOrder.products.forEach((product) => {
        const updatedProduct = newProductQuantity.find(
          (data) => data.SKU === product.SKU,
        );
        if (updatedProduct) {
          product.NewQuantity = updatedProduct.NewQuantity;
        }
      });
      const updateRestockOrder = await restockOrder.save();
      const updatedOrder = await order.save();
      res.status(200).send({
        status: 'success',
        message: 'Product quantities updated successfully',
        updatedOrder,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOrderItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { SKU } = req.body;
      const order = await this.overseasOrderModel.findById(id);

      if (!order) {
        return res.status(404).send({
          status: 'error',
          message: 'Overseas order not found',
        });
      }

      const restockOrder = await this.restockModel.findOne({
        restockId: order.restockId,
      });

      if (!restockOrder) {
        return res.status(404).send({
          status: 'error',
          message: 'thier is no Restock order Associated with this order',
        });
      }

      // Find the index of the product with the matching SKU
      const productIndex = order.products.findIndex(
        (product) => product.SKU === SKU,
      );

      // Find the index of the product with the matching SKU
      const productIndexRestock = restockOrder.products.findIndex(
        (product) => product.SKU === SKU,
      );

      if (productIndex === -1 || productIndexRestock === -1) {
        return res.status(404).send({
          status: 'error',
          message: 'Product not found in the order',
        });
      }

      // Remove the product from the products array
      order.products.splice(productIndex, 1);

      // update the restock order status

      restockOrder.products[productIndexRestock].Status = 'generated';

      await restockOrder.save();

      const updatedOrder = await order.save();

      res.status(200).send({
        status: 'success',
        message: 'Product deleted successfully',
        updatedOrder,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateRequireQtyAndPrice(
    req: Request,
    res: Response,
    type: string,
    id: string,
  ) {
    try {
      const validQueryTypes = ['NewQuantity', 'Price'];

      if (!type || !validQueryTypes.includes(type)) {
        throw new BadRequestException(
          'Invalid query type. Expected one of: NewQuantity, Price',
        );
      }

      if (!id) {
        throw new BadRequestException('Id is required');
      }

      const updateDataArray = req.body.products;
      if (!Array.isArray(updateDataArray) || updateDataArray.length === 0) {
        throw new BadRequestException(
          'Invalid data format. Expected an array of objects with "sku" and "value" properties',
        );
      }

      const overseasOrder = await this.overseasOrderModel.findById({
        _id: id,
      });
      if (!overseasOrder) {
        throw new NotFoundException(`Overseas order with id '${id}' not found`);
      }

      for (const updateData of updateDataArray) {
        const { SKU, value } = updateData;

        if (!SKU || value === undefined) {
          throw new BadRequestException(
            'SKU and either Price or NewQuantity are required',
          );
        }

        const productIndex = overseasOrder.products.findIndex(
          (product) => product.SKU === SKU,
        );
        if (productIndex === -1) {
          throw new NotFoundException(
            `Product with SKU '${SKU}' not found in the Overseas Order`,
          );
        }

        // Construct the update query using the dot notation
        const updateQuery = {
          $set: { [`products.${productIndex}.${type}`]: value },
        };

        // Apply the update query using the findOneAndUpdate method
        const updatedOverseasOrder =
          await this.overseasOrderModel.findOneAndUpdate(
            { _id: id, 'products.SKU': SKU },
            updateQuery,
            { new: true },
          );

        if (!updatedOverseasOrder) {
          throw new NotFoundException(
            `Product with SKU '${SKU}' not found in the Overseas Order`,
          );
        }
      }

      res
        .status(200)
        .send({ status: 'success', message: 'Updated successfully' });
    } catch (error) {
      throw new Error(error.message || 'An error occurred during the update');
    }
  }

  async getOverseasByVendor(id: string, res: Response) {
    try {
      const vendor = await this.overseasOrderModel.find({ VendorId: id });
      res.status(200).send({
        status: 'success',
        message: 'Vendor successfully fetched',
        data: vendor,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async downloadPIPDF(id: string, res: Response) {
    try {
      const overseasOrder: any = await this.overseasOrderModel.findById(id);

      if (!overseasOrder) {
        throw new NotFoundException(`OverSeas order not found `);
      }

      const vendorDetails = await this.vendorModel.findOne({
        VendorId: overseasOrder.VendorId,
      });

      const data = {
        PI: overseasOrder.overSeasOrderId,
        products: overseasOrder.products,
        date: overseasOrder.updatedAt,
        subTotal: overseasOrder.products.reduce(
          (acc, product) => acc + product.Price * product.NewQuantity,
          0,
        ),
        vendorDetails: {
          companyName: vendorDetails.CompanyName,
          ConcernPerson: vendorDetails.ConcernPerson,
          Address: vendorDetails.address[0],
        },
      };

      // Send the PDF file as a response to the client
      const filePath = `${overseasOrder.overSeasOrderId}.pdf`;

      PI_PDF_Generator(data, filePath, res);

      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async uploadOverseasOrderReciept(
    id: string,
    res: Response,
    files: any,
    req: Request,
  ) {
    try {
      const uploadedFiles = files.reciept || [];
      if (!uploadedFiles || uploadedFiles.length === 0 || !id) {
        throw new BadRequestException('No files uploaded');
      }
      const overseasOrder: any = await this.overseasOrderModel.findById(id);

      if (!overseasOrder) {
        throw new BadRequestException('No overSeasOrder found');
      }
      const filePath = `/${Date.now()}/${uploadedFiles[0].originalname}`;
      const folderPath = `${process.env.IMAGEKIT_FOLDER}/OverseasOrderReciept`;

      const uploadResponse = await imagekit.upload({
        file: uploadedFiles[0].buffer,
        fileName: filePath,
        folder: folderPath,
      });

      overseasOrder.Reciept = uploadResponse.url;
      overseasOrder.status = 'paid';
      await overseasOrder.save();
      console.log(uploadResponse);
      return res.status(200).send({
        status: 'success',
        message: 'OverSeas order Payment reciept updated successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // assign order to vendor
  async assignOrder(req: Request, res: Response) {
    try {
      const { restockId, vendor } = req.body;

      const restock = await this.priceComparisionModel.findOne({ compareId: restockId });
      if (!restock) {
        throw new NotFoundException(
          'Restock not found with this id: ' + restockId,
        );
      }
      restock.assign = vendor;
      restock.isAssigned = true;
      await restock.save();
      res.status(201).send({
        status: 'success',
        message: 'your order has been assigned successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // vedor section for add price for comparision purposes
  async addPriceForVendor(vendorPrice: UpdatePriceRequestDto, res: Response) {
    try {
      const { restockId, products, vendorId } = vendorPrice;
      const restock = await this.priceComparisionModel.findOne({ compareId: restockId });
      if (!restock) {
        throw new NotFoundException(
          'Restock not found with this id: ' + restockId,
        );
      }

      const updatedProduct = restock.products.map((item: any) => {
        let updateComparisonPrice = {};

        products.forEach((product: any) => {
          if (product.SKU === item.SKU) {
            updateComparisonPrice = { [vendorId]: product.price };
          }
        });

        const oldComparisonPrice = { ...item.comparison };
        // console.log(item.comparison);
        return {
          ...item.toObject(),
          comparison: { ...oldComparisonPrice, ...updateComparisonPrice },
        };
      });

      restock.products = updatedProduct;
      restock.save();

      res.status(201).send({ status: 'success', message: restock.products });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all single price comparisons
  async getPriceComparison(id: string, res: Response) {
    try {
      const restock = await this.restockModel.findOne({ restockId: id });
      if (!restock) {
        throw new NotFoundException('Restock not found with this id: ' + id);
      }

      /// get vendor details
      const vendorDetails = await this.vendorModel.aggregate([
        { $match: { VendorId: { $in: restock.assign } } },
        {
          $project: {
            headerName: '$ConcernPerson',
            field: '$VendorId',
            _id: 0,
          },
        },
      ]);

      // Extract the assign array to use for comparison
      const assignedVendors = restock.assign;

      // Process each product in the "products" array
      const processedProducts: any = restock.products.map((product: any) => {
        const newProduct: any = { ...product.toObject() };
        newProduct.comparisonValues = {}; // Create an object to store the comparison values

        assignedVendors.forEach((vendor) => {
          // Check if the vendor exists in the comparison object for this product
          if (product.comparison && vendor in product.comparison) {
            newProduct[vendor] = product.comparison[vendor];
          } else {
            newProduct[vendor] = 0; // Set to 0 if the vendor is not found
          }
        });

        return newProduct;
      });

      const arr = [...processedProducts];
      arr.forEach((product) => {
        const comparison = product.comparison ? product.comparison : {};
        const vendors = Object.entries(comparison); // Convert comparison object to array of [vendorId, value] pairs

        // Sort the vendors based on their values
        vendors.sort((a: any, b: any) => a[1] - b[1]);

        if (!vendors.length) {
          product['high'] = [];
          product['medium'] = [];
          product['low'] = [];
          return;
        }
        const highestValue = vendors[vendors.length - 1][1];
        const lowestValue = vendors[0][1];
        const middleVendors = [];
        const highVendors = [];
        const lowVendors = [];

        // Separate vendors into high, medium, and low categories
        vendors.forEach((vendor) => {
          const [vendorId, value] = vendor;
          if (value === highestValue) {
            highVendors.push(vendorId);
          } else if (value === lowestValue) {
            lowVendors.push(vendorId);
          } else {
            middleVendors.push(vendorId);
          }
        });

        product['high'] = highVendors;
        product['medium'] = middleVendors;
        product['low'] = lowVendors;
      });
      console.log(arr);

      res.status(200).send({
        status: 'success',
        message: 'Price Successfully fetched',
        data: {
          ...restock.toObject(),
          products: processedProducts,
          columns: vendorDetails,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //  to compare price to vendo
  async getPriceCompareVendor(id: string, res: Response) {
    try {
      const restock = await this.priceComparisionModel
        .find({
          assign: id,
          isClosed: false,
        })
        .exec();

      let data = [];
      if (restock.length) {
        const processedRestock = restock.map((item) => {
          const status = item.products.some((product) => {
            if (product.comparison) {
              return product.comparison.hasOwnProperty(id);
            }
            return false; // Return false in case the product does not have 'comparison'
          });

          return {
            ...item.toObject(),
            products: item.products.length,
            isSubmitted: status,
            assign: null,
          };
        });
        data = processedRestock;
      }
      res.status(200).send({
        status: 200,
        message: 'Price Successfully fetched',
        data: data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // to get one price comparision vendor
  async getOnePriceCompareVendor(req: any, res: Response) {
    try {
      const { restockId, vendorId } = req.body;
      console.log(restockId,vendorId)
      const restock = await this.priceComparisionModel.findOne({
        compareId: restockId,
      });
      let data = [];
      if (restock) {
        const processedProductPrices = restock.products.map((item: any) => {
          if (item.comparison) {
            return {
              ...item.toObject(),
              price: item.comparison[vendorId] ? item.comparison[vendorId] : 0,
            };
          } else {
            return {
              ...item.toObject(),
              price: 0,
            };
          }
        });

        data = processedProductPrices;
      }

      res.status(200).send({
        status: 200,
        message: 'Price Successfully fetched',
        data: { compareId: restock.compareId, products: data },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get single oversease order
  async getOverseaseOrder(id: string, res: Response) {
    try {
      const order = await this.overseasOrderModel
        .findOne({ overSeasOrderId: id })
        .select('products');
      if (!order) {
        throw new NotFoundException('Order not found with id: ' + id);
      }
      res.status(200).send({
        status: 'success',
        message: 'Order succesfully found',
        order: order,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // to create create price comparision
  async createPriceComparision(
    createPriceComparisionDto: CreatePriceComparisionDto,
    res: Response,
  ) {
    try {
      const { priceComparision } = createPriceComparisionDto;
      if (!Array.isArray(priceComparision) || priceComparision.length === 0) {
        throw new BadRequestException(
          'At least one restock object is required',
        );
      }

      const invalidObjects = priceComparision.filter(
        (dto) => !dto.SKU || !dto.Name || !dto.NewQuantity,
      );

      if (invalidObjects.length > 0) {
        throw new BadRequestException('All fields are required');
      }

      const compareId = `PC${generateRandomNumber(6)}`;
      const products = priceComparision.map((dto) => ({
        SKU: dto.SKU,
        Name: dto.Name,
        Brand: dto.Brand,
        Category: dto.Category,
        NewQuantity: dto.NewQuantity,
        ThresholdQty: dto.ThresholdQty,
        Quantity: dto.Quantity,
      }));

      // console.log(products);
      const priceComparisions = await this.priceComparisionModel.create({
        compareId,
        products,
      });

      return res.status(201).send({
        status: 'success',
        message: 'Price Comparision successfully created',
        data: priceComparisions,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // to get all price comparision data
  async getPriceComparision(res:Response) {
    try {
      const priceComparision = await this.priceComparisionModel.find({});
      res.status(200).send({status:"success",message:"Price comparision successfully retrieved", data: priceComparision})
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //to get single price comparision data with comparison id
  async getSinglePriceComaprarision(id:string,res:Response) {
    try {
      const restock = await this.priceComparisionModel.findOne({ compareId: id });
      if (!restock) {
        throw new NotFoundException('Restock not found with this id: ' + id);
      }

      /// get vendor details
      const vendorDetails = await this.vendorModel.aggregate([
        { $match: { VendorId: { $in: restock.assign } } },
        {
          $project: {
            headerName: '$ConcernPerson',
            field: '$VendorId',
            _id: 0,
          },
        },
      ]);

      // Extract the assign array to use for comparison
      const assignedVendors = restock.assign;

      // Process each product in the "products" array
      const processedProducts: any = restock.products.map((product: any) => {
        const newProduct: any = { ...product.toObject() };
        newProduct.comparisonValues = {}; // Create an object to store the comparison values

        assignedVendors.forEach((vendor) => {
          // Check if the vendor exists in the comparison object for this product
          if (product.comparison && vendor in product.comparison) {
            newProduct[vendor] = product.comparison[vendor];
          } else {
            newProduct[vendor] = 0; // Set to 0 if the vendor is not found
          }
        });

        return newProduct;
      });

      const arr = [...processedProducts];
      arr.forEach((product) => {
        const comparison = product.comparison ? product.comparison : {};
        const vendors = Object.entries(comparison); // Convert comparison object to array of [vendorId, value] pairs

        // Sort the vendors based on their values
        vendors.sort((a: any, b: any) => a[1] - b[1]);

        if (!vendors.length) {
          product['high'] = [];
          product['medium'] = [];
          product['low'] = [];
          return;
        }
        const highestValue = vendors[vendors.length - 1][1];
        const lowestValue = vendors[0][1];
        const middleVendors = [];
        const highVendors = [];
        const lowVendors = [];

        // Separate vendors into high, medium, and low categories
        vendors.forEach((vendor) => {
          const [vendorId, value] = vendor;
          if (value === highestValue) {
            highVendors.push(vendorId);
          } else if (value === lowestValue) {
            lowVendors.push(vendorId);
          } else {
            middleVendors.push(vendorId);
          }
        });

        product['high'] = highVendors;
        product['medium'] = middleVendors;
        product['low'] = lowVendors;
      });
      console.log(arr);

      res.status(200).send({
        status: 'success',
        message: 'Price Successfully fetched',
        data: {
          ...restock.toObject(),
          products: processedProducts,
          columns: vendorDetails,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}