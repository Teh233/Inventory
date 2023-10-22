import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as excel from 'exceljs';
import {
  roboproducts,
  roboproducthistory,
} from './schema/robo-products.schema';
import { Calc, CalcSchema } from './schema/calc.schema';
import { WebsocketEventsService } from 'src/websocket-events/websocket-events.service';
import { BarcodeGen } from 'src/barcode/schema/barcode.schema';
import { Response, Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { BarcodeService } from 'src/barcode/barcode.service';
import { generateRandomNumber } from 'src/common/utils/common.utils';
import {
  UpdateOneRoboProductDto,
  addProducutBulkDto,
  addRoboProductDto,
} from './dto/create-product.dto';
import axios from 'axios';
import { Brand } from './schema/brand.schema';
import { error } from 'console';
// SDK initialization
// SDK initialization

var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_o1s1y5LM7H/TAIj9bu/vJfHUyjc=',
  privateKey: 'private_Z7RuSoi4w5oqLCZZ9EGntsHjSz8=',
  urlEndpoint: 'https://ik.imagekit.io/f68owkbg7',
});

@Injectable()
export class RoboProductsService {
  constructor(
    @InjectModel(roboproducts.name)
    private roboProductsModel: Model<roboproducts>,
    @InjectModel(roboproducthistory.name)
    private roboProductHistoryModel: Model<roboproducthistory>,
    @InjectModel(Brand.name) private BrandModel: Model<Brand>,
    @InjectModel(Calc.name) private CalcModel: Model<Calc>,
    private readonly barcodeService: BarcodeService,
    private readonly websocketEvent: WebsocketEventsService,
  ) {}

  // get all products
  async findAll(
    res: Response,
    filters: any,
  ): Promise<{
    status: string;
    message: string;
    total: number;
    data: roboproducts[];
    brands: string[];
    categories: string[];
    searchTerm: string;
  }> {
    try {
      let query: any;
      const page: number = filters.page;
      const limit: number = 48;
      let categories = await this.roboProductsModel
        .aggregate([
          {
            $match: {
              isWholeSaleActive: true,
            },
          },
          {
            $group: {
              _id: '$Category',
            },
          },
        ])
        .exec();
      let brandData = await this.roboProductsModel
        .aggregate([
          {
            $match: {
              isWholeSaleActive: true,
            },
          },
          {
            $group: {
              _id: '$Brand',
            },
          },
        ])
        .exec();

      categories = categories.map((category) => category['_id']);
      brandData = brandData.map((brand) => brand['_id']);

      const brands = await this.BrandModel.find({
        BrandName: { $in: brandData },
      }).exec();

      // const brands = await this.BrandModel.find().exec();

      if (filters && filters.searchTerm) {
        const searchQuery = [
          {
            $search: {
              index: 'searchRoboProducts',
              text: {
                query: filters.searchTerm,
                path: 'Name',
                fuzzy: {},
              },
            },
          },
          {
            $match: {
              isWholeSaleActive: true,
            },
          },
          {
            $project: {
              Name: 1,
              SKU: 1,
              Brand: 1,
              Category: 1,
              SubCategory: 1,
              Weight: 1,
              SalesPrice: { $ifNull: ['$SalesPrice', 0] },
              Dimensions: 1,
              SellerPrice: { $ifNull: ['$SellerPrice', 0] },
              mainImage: 1,
              sideImage: 1,
              Notation: 1,
            },
          },
        ];

        const aggregationResult: any = await this.roboProductsModel
          .aggregate(searchQuery)
          .exec();

        const total = aggregationResult.length;

        const startIndex = page * limit;
        const endIndex = startIndex + limit;

        const allProduct = aggregationResult.slice(startIndex, endIndex);

        const response = {
          status: 'success',
          message: 'Data successfully fetched',
          pageNo: +page,
          totalPages: Math.ceil(total / limit),
          total,
          sentTotal: allProduct.length,
          limit: limit,
          brands,
          categories,
          data: allProduct,
        };

        res.status(200).send(response);
        return;
      } else {
        // Define the filter criteria and sort options
        const filterCriteria = {
          isWholeSaleActive: true,
        };

        const normalResult = this.roboProductsModel
          .find(filterCriteria)
          .sort({ updatedAt: -1 });

        query = normalResult;

        if (filters && filters.brand) {
          let brandArray: string[] = [];

          if (Array.isArray(filters.brand)) {
            brandArray = filters.brand;
          } else {
            brandArray = [filters.brand];
          }

          query = query.where('Brand').in(brandArray);
        }

        if (filters && filters.category) {
          query = query.where('Category').equals(filters.category);
        }

        const total = await this.roboProductsModel.countDocuments(query).exec();

        query.skip(page * limit).limit(limit);
        const allProduct = await query
          .select(
            'SKU Name Brand Category SubCategory Weight SalesPrice Dimensions SellerPrice mainImage sideImage Notation',
          )
          .exec();

        const response = {
          status: 'success',
          message: 'Data successfully fetched',
          pageNo: +page,
          totalPages: Math.ceil(total / limit),
          total,
          sentTotal: allProduct.length,
          limit: limit,
          brands,
          categories,
          data: allProduct,
        };

        res.status(200).send(response);
        return;
      }
    } catch (err) {
      res.status(501).send({
        status: 'error',
        message: err.message,
      });
    }
  }

  async sellerSearch(res: Response) {
    try {
      const query = this.roboProductsModel.find({});
      if (!query) {
        res.status(404).send({
          status: 'error',
          message: 'Data not found',
        });
        return;
      }
      const allProduct = await query.select('SKU Name ').exec();

      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        data: allProduct,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get single product
  async getOneProduct(id: string, res: Response) {
    try {
      const product = await this.roboProductsModel
        .findOne({ SKU: id })
        .select(
          'SKU Name Brand Category SubCategory Weight SalesPrice Dimensions SellerPrice mainImage sideImage Notation',
        )
        .exec();

      if (!product) {
        return res.status(404).send({
          status: 'error',
          message: 'Product not found',
        });
      }

      return res.status(200).send({
        status: 'success',
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // MongoDB Atlas Full-Text Search query
  async indexAutoComplete(res: Response, query: any) {
    try {
      const { searchTerm } = query;

      const searchQuery = [
        {
          $search: {
            index: 'searchRoboProducts',
            text: {
              query: searchTerm,
              path: 'Name',
              fuzzy: {},
            },
          },
        },
        {
          $match: {
            isWholeSaleActive: true,
          },
        },
        {
          $limit: 30,
        },
        {
          $project: {
            Name: 1,
            SKU: 1,
            mainImage: 1,
          },
        },
      ];

      // Execute the aggregation using .exec() and collect the results in an array
      const aggregationResult = await this.roboProductsModel
        .aggregate(searchQuery)
        .exec();

      // Calculate the count from the length of the aggregation result array
      const count = aggregationResult.length;

      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        count: count,
        data: aggregationResult,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  ////// admin section starts from here /////

  /// Functions

  // findProductBySKU in Ecwid F--
  async findEcwidProductBySKU(sku) {
    try {
      const response = await axios.get(
        `https://app.ecwid.com/api/v3/${process.env.STORE_ID}/products?sku=${sku}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY}`,
          },
        },
      );

      // Check if a product was found
      if (response.data && response.data.count > 0) {
        const product = response.data.items[0]; // Assuming the first item in the list is the product
        return product;
      } else {
        return null;
      }
    } catch (error) {
      // Handle the error here
      console.error('An error occurred while finding the product onEcwid:');
      // You can choose to return null or handle the error differently based on your requirements
      return null;
    }
  }

  // update Product in Ecwid F--
  async updateProductOnEcwid(params, sku) {
    try {
      // Find the product by SKU
      const product = await this.findEcwidProductBySKU(sku);

      // Check if the product was not found
      if (!product) {
        console.log('Product not found.');
        return false;
      }

      // Extract the product ID
      const productId = product.id;

      // Prepare the updated data
      const updatedData = params;

      // Send a PUT request to update the product
      const updateResponse = await axios.put(
        `https://app.ecwid.com/api/v3/${process.env.STORE_ID}/products/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${process.env.SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the update was successful
      if (updateResponse.status === 200) {
        console.log('Product updated successfully.');
        return true;
      } else {
        console.log('Product update failed.');
        return false;
      }
    } catch (error) {
      // Handle the error here
      console.error('An error occurred while updating the product on Ecwid:');
      // You can choose to return false or handle the error differently based on your requirements
      return false;
    }
  }

  // add robo products
  async addRoboProduct(addRoboProduct: addProducutBulkDto, res) {
    try {
      const { products } = addRoboProduct;
      const date = new Date();
      const createdProducts = [];

      for (const product of products) {
        const no = generateRandomNumber(6);
        const SKU = `IRS${JSON.stringify(date.getFullYear()).slice(
          2,
          4,
        )}${JSON.stringify(date.getMonth() + 1).padStart(2, '0')}${no}`;

        const info = {
          SKU: SKU,
          Name: product.name,
          Brand: product.brand,
          Category: product.category,
          SubCategory: product.subCategory,
          Weight: product.weight,
          GST: product.gst,
          Dimensions: product.dimensions,
          subItems: product.subItems,
        };

        // Create the product using the model
        const createdProduct = await this.roboProductsModel.create(info);
        createdProducts.push(createdProduct);
        // You might want to handle the created product or push it to an array if needed
      }

      res.status(201).send({
        status: 'success',
        message: 'Robo Products created successfully',
        product: createdProducts,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update one robo product
  async updateOneRoboProduct(
    id: string,
    updateOneRoboProduct: UpdateOneRoboProductDto,
    res: Response,
  ) {
    try {
      const {
        name,
        brand,
        category,
        subCategory,
        weight,
        dimensions,
        subItems,
        salestax,
        sellertax,
      } = updateOneRoboProduct;
      const updateObject = {
        Name: name,
        Brand: brand,
        Category: category,
        SubCategory: subCategory,
        SalesTax: salestax,
        SellerTax: sellertax,
        Weight: weight,
        Dimensions: dimensions,
        subItems: subItems,
      };
      const updateProduct = await this.roboProductsModel.findOneAndUpdate(
        { SKU: id },
        updateObject,
        { new: true },
      );
      res.status(201).send({
        status: 'success',
        message: 'Robo Product updated successfully',
        data: updateProduct,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all products
  async findAllProducts(
    res: Response,
    filters: any,
  ): Promise<{
    status: string;
    message: string;
    total: number;
    data: roboproducts[];
    brands: string[];
    categories: string[];
  }> {
    try {
      let allProduct = [];

      if (filters && filters.searchTerm && filters.searchTerm !== 'null') {
        const aggregationResult: any = await this.roboProductsModel
          .aggregate([
            {
              $search: {
                index: 'searchRoboProducts',
                text: {
                  query: filters.searchTerm,
                  path: 'Name',
                  fuzzy: {},
                },
              },
            },
            {
              $addFields: {
                Weight: { $ifNull: ['$Weight', 0] },
                SalesPrice: { $ifNull: ['$SalesPrice', 0] },
                SellerTax: { $ifNull: ['$SellerTax', 0] },
                SalesTax: { $ifNull: ['$SalesTax', 0] },
                SellerPrice: { $ifNull: ['$SellerPrice', 0] },
                LandingCost: { $ifNull: ['$LandingCost', 0] },
                Quantity: { $ifNull: ['$Quantity', 0] },
                ThresholdQty: { $ifNull: ['$ThresholdQty', 0] },
                GST: { $ifNull: ['$GST', 0] },
                MRP: { $ifNull: ['$MRP', 0] },
                ActualQuantity: { $ifNull: ['$ActualQuantity', 0] },
                PendingQuantity: { $ifNull: ['$PendingQuantity', 0] },
                PendingMRP: { $ifNull: ['$PendingMRP', 0] },
                PendingSalesPrice: { $ifNull: ['$PendingSalesPrice', 0] },
                PendingSellerPrice: { $ifNull: ['$PendingSellerPrice', 0] },
                PendingLandingCost: { $ifNull: ['$PendingLandingCost', 0] },
                isVerifiedQuantity: { $ifNull: ['$isVerifiedQuantity', true] },
                isRejectedQuantity: { $ifNull: ['$isRejectedQuantity', false] },
                isVerifiedMRP: { $ifNull: ['$isVerifiedMRP', true] },
                isRejectedMRP: { $ifNull: ['$isRejectedMRP', false] },
                isVerifiedSalesPrice: {
                  $ifNull: ['$isVerifiedSalesPrice', true],
                },
                isRejectedSalesPrice: {
                  $ifNull: ['$isRejectedSalesPrice', false],
                },
                isVerifiedSellerPrice: {
                  $ifNull: ['$isVerifiedSellerPrice', true],
                },
                isRejectedSellerPrice: {
                  $ifNull: ['$isRejectedSellerPrice', false],
                },
                isVerifiedLandingCost: {
                  $ifNull: ['$isVerifiedLandingCost', true],
                },
                isRejectedLandingCost: {
                  $ifNull: ['$isRejectedLandingCost', false],
                },
                isFullFilled: { $ifNull: ['$isFullFilled', false] },
                isEcwidSync: { $ifNull: ['$isEcwidSync', false] },
                isWholeSaleActive: { $ifNull: ['$isWholeSaleActive', false] },
              },
            },
          ])
          .exec();

        allProduct = aggregationResult;
      } else {
        let query = this.roboProductsModel.find().sort({ updatedAt: -1 });
        allProduct = await query.exec();
      }

      const brands = await this.roboProductsModel.distinct('Brand').exec();

      const categories = await this.roboProductsModel
        .distinct('Category')
        .exec();

      const response = {
        status: 'success',
        message: 'Data successfully fetched',
        total: allProduct.length,
        brands,
        categories,
        data: allProduct,
      };

      res.status(200).send(response);
      return;
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Update Products Column
  async updateProducts(query: string, res: Response, req: Request) {
    const validQueryTypes = [
      'Quantity',
      'SalesPrice',
      'SellerPrice',
      'MRP',
      'ThresholdQty',
      'LandingCost',
      'GST',
      'SellerTax',
      'SalesTax',
    ];

    if (!query || !validQueryTypes.includes(query)) {
      return res.status(400).send({
        status: 'error',
        message:
          'Invalid query type. Expected one of: Quantity, SalesPrice, SellerPrice, MRP, ThresholdQty',
      });
    }

    const { products } = req.body;
    const newData = Array.isArray(products) ? products : [products];
    try {
      switch (query) {
        case 'MRP':
        case 'Quantity':
        case 'SalesPrice':
        case 'SellerPrice':
        case 'LandingCost':
          // Update the corresponding field for each SKU in the model here
          for (const product of newData) {
            const { SKU, value } = product;
            const dbUpdateQuery = {
              $set: {
                [`Pending${query}`]: value,
                [`isVerified${query}`]: false,
                [`isRejected${query}`]: false,
              },
            };
            const updatedProduct =
              await this.roboProductsModel.findOneAndUpdate(
                { SKU: SKU },
                dbUpdateQuery,
              );

            if (!updatedProduct) {
              return res.status(404).send({
                status: 'error',
                message: `Product not found for SKU: ${SKU}`,
              });
            }
          }
          break;
        case 'ThresholdQty':
          for (const product of newData) {
            const { SKU, value } = product;
            const updatedProduct =
              await this.roboProductsModel.findOneAndUpdate(
                { SKU: SKU },
                { $set: { [query]: value } },
              );

            if (!updatedProduct) {
              return res.status(404).send({
                status: 'error',
                message: `Product not found for SKU: ${SKU}`,
              });
            }
          }
          return res.status(201).send({
            status: 'success',
            message: 'Threshold quantity updated successfully',
          });

        case 'GST':
          for (const product of newData) {
            const { SKU, value } = product;
            const updatedProduct =
              await this.roboProductsModel.findOneAndUpdate(
                { SKU: SKU },
                { $set: { [query]: value } },
              );

            if (!updatedProduct) {
              return res.status(404).send({
                status: 'error',
                message: `Product not found for SKU: ${SKU}`,
              });
            }
          }
          return res.status(201).send({
            status: 'success',
            message: 'GST quantity updated successfully',
          });
        case 'SellerTax':
          for (const product of newData) {
            const { SKU, value } = product;

            const updatedProduct =
              await this.roboProductsModel.findOneAndUpdate(
                { SKU: SKU },
                { $set: { [query]: value } },
              );

            if (!updatedProduct) {
              return res.status(404).send({
                status: 'error',
                message: `Product not found for SKU: ${SKU}`,
              });
            }
          }
          return res.status(201).send({
            status: 'success',
            message: 'SellerTax  updated successfully',
          });
        case 'SalesTax':
          for (const product of newData) {
            const { SKU, value } = product;
            const updatedProduct =
              await this.roboProductsModel.findOneAndUpdate(
                { SKU: SKU },
                { $set: { [query]: value } },
              );

            if (!updatedProduct) {
              return res.status(404).send({
                status: 'error',
                message: `Product not found for SKU: ${SKU}`,
              });
            }
          }
          return res.status(201).send({
            status: 'success',
            message: 'SalesTax  updated successfully',
          });

        default:
          return res.status(400).send({
            status: 'error',
            message:
              'Invalid query type. Expected one of: Quantity, SalesPrice, SellerPrice, MRP, ThresholdQty',
          });
      }

      return res.status(200).send({
        status: 'success',
        message: `${query} updated successfully, waiting for admin approval`,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Update Approval
  async updateApproval(query: string, res: Response, req: Request) {
    const validQueryTypes = [
      'Quantity',
      'SalesPrice',
      'SellerPrice',
      'MRP',
      'LandingCost',
    ];

    const historyType = (str: string) => {
      switch (str) {
        case 'MRP':
          return 'mrp';
        case 'SalesPrice':
          return 'salesPrice';
        case 'Quantity':
          return 'quantity';
        case 'LandingCost':
          return 'landingCost';
        case 'SellerPrice':
          return 'sellerPrice';
        default:
          // Handle the pending cases here, or throw an error for invalid inputs
          throw new Error(`Invalid history type: ${str}`);
      }
    };

    const ecwidUpdateTrack = [];
    const ecwidUpdateTrackFail = [];

    if (!query || !validQueryTypes.includes(query)) {
      return res.status(400).send({
        status: 'error',
        message:
          'Invalid query type. Expected one of: Quantity, SalesPrice, SellerPrice, MRP, LandingCost',
      });
    }

    const { products } = req.body;
    const newData = Array.isArray(products) ? products : [products];
    const isAllValid = newData.every((item) => typeof item.value === 'boolean');
    if (!isAllValid) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid value enum',
      });
    }

    try {
      for (const product of newData) {
        const { SKU, value } = product;
        const productData = await this.roboProductsModel.findOne({ SKU });
        const newStock = productData.PendingQuantity;

        if (!productData) {
          return res.status(404).send({
            status: 'error',
            message: `Product not found for SKU: ${SKU}`,
          });
        }

        if (query === 'Quantity') {
          productData[query] = value
            ? productData[`Pending${query}`] + productData.Quantity
            : productData[query];
        } else {
          productData[query] = value
            ? productData[`Pending${query}`]
            : productData[query];
        }

        productData[`Pending${query}`] = 0;
        productData[`isVerified${query}`] = true;
        productData[`isRejected${query}`] = !value;

        const updatedProduct = await productData.save();

        if (updatedProduct && value) {
          if (query === 'Quantity') {
            // Call the updateBarcode function from the BarcodeService only for Quantity approval
            // console.log(newStock);
            await this.barcodeService.updateBarcode(SKU, newStock);
          }

          if (query === 'SalesPrice' && updatedProduct.isEcwidSync) {
            const params = {
              price: Math.floor(
                (Number(updatedProduct.SalesPrice) / 100) *
                  (100 + Number(updatedProduct.GST)),
              ),
            };

            const isSuccess = await this.updateProductOnEcwid(params, SKU);
            if (isSuccess) {
              ecwidUpdateTrack.push(
                `Sale Price of ${updatedProduct.Name} is Sync with Ecwid`,
              );
            } else {
              ecwidUpdateTrackFail.push(
                `Sale Price Sync of ${updatedProduct.Name} Failed`,
              );
            }
          }
          const createHistory = await this.roboProductHistoryModel.create({
            SKU: updatedProduct.SKU,
            Date: new Date().toISOString(),
            Quantity: updatedProduct.Quantity,
            GST: updatedProduct.GST,
            SalesPrice: updatedProduct.SalesPrice,
            MRP: updatedProduct.MRP,
            LandingCost: updatedProduct.LandingCost,
            SellerPrice: updatedProduct.SellerPrice,
            Type: historyType(query),
          });
        }
      }

      return res.status(200).send({
        status: 'success',
        message: `${query} Approved successfully`,
        ecwidUpdateTrack,
        ecwidUpdateTrackFail,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get unApprovedProduct
  async getUnApprovedProduct(query: string, res: Response) {
    try {
      const validQueryTypes = [
        'Quantity',
        'SalesPrice',
        'SellerPrice',
        'MRP',
        'LandingCost',
      ];

      if (!query || !validQueryTypes.includes(query)) {
        return res.status(400).send({
          status: 'error',
          message:
            'Invalid query type. Expected one of: Quantity, SalesPrice, SellerPrice, MRP',
        });
      }

      const productData = await this.roboProductsModel
        .find({
          [`isVerified${query}`]: false,
        })
        .select(
          `SKU Name Brand Category GST Pending${query} ${
            query === 'Quantity' ? 'ActualQuantity' : query
          } ${
            query === 'MRP' || query === 'SalesPrice' || query === 'SellerPrice'
              ? 'SalesTax SellerTax LandingCost SellerPrice SalesPrice'
              : ''
          }`,
        );

      return res.status(200).send({
        status: 'success',
        message: `fetched ${query} unApproved products successfully`,
        data: productData,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // update Single Product Notation
  async updateNotation(id: string, req: Request, res: Response) {
    try {
      const { data, type } = req.body;

      if (!id) {
        res.status(404).send({ status: 'error', message: 'plz provide id' });
        return;
      }

      const roboProduct = await this.roboProductsModel.findOne({ SKU: id });
      if (!roboProduct) {
        res.status(404).send({ status: 'error', message: 'Product not found' });
      }

      if (type === 'Notation') {
        roboProduct.Notation = data;
      } else if (type === 'isEcwidSync') {
        const isEcwidExist = await this.findEcwidProductBySKU(id);
        if (!isEcwidExist && isEcwidExist === null && data) {
          return res
            .status(404)
            .send({ status: 'error', message: 'Product Not found on Ecwid' });
        }
        roboProduct.isEcwidSync = data;
      } else if (type === 'isWholeSaleActive') {
        const isMainImageExist = roboProduct.mainImage;
        if ((!isMainImageExist || !isMainImageExist.fileId) && data) {
          return res.status(400).send({
            status: 'error',
            message: `${roboProduct.Name} image does not exist, !Failed to Activate`,
          });
        }
        roboProduct.isWholeSaleActive = data;
      }

      await roboProduct.save();
      res.status(200).send({
        status: 'success',
        message: `Product ${id} ${type} updated successfully`,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get One Product History
  async getProductHistory(id: string, res: Response) {
    try {
      if (!id) {
        res
          .status(404)
          .send({ status: 'error', message: 'plz provide Product SKU' });
        return;
      }

      const roboProductHistory = await this.roboProductHistoryModel
        .find({ SKU: id })
        .sort({ Date: -1 });

      res.status(200).send({
        status: 'success',
        message: 'Product History fetched successfully',
        data: roboProductHistory,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get all product by search
  async searchProduct(res: Response) {
    try {
      const query = this.roboProductsModel.find();
      if (!query) {
        res.status(404).send({
          status: 'error',
          message: 'Data not found',
        });
        return;
      }
      const allProduct = await query
        .select('SKU Name Weight Dimensions GST LandingCost ')
        .exec();

      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        data: allProduct,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get single product
  async getSingleProrduct(sku: String, res: Response) {
    try {
      const product = await this.roboProductsModel.findOne({ SKU: sku });
      if (!product) {
        res.status(404).send({ status: 'error', message: 'product not found' });
        return;
      }

      /// findProduct in Ecwid

      // fake params
      const params = {
        price: 3499,
      };

      // const ecwidProduct = await this.updateProductOnEcwid(params, sku);

      res.status(200).send({
        status: 'success',
        message: 'product successfully retrieved',
        data: product,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // upload side imgages under 100kb and max can be 5
  async uploadMultipleImages(
    sku: string,
    res: Response,
    files: any,
    req: Request,
  ) {
    try {
      const uploadedFiles = files.Images || []; // Access the uploaded files using the field name 'Images'
      // console.log(uploadedFiles)
      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const sideImages = [];

      const existingRoboProduct = await this.roboProductsModel.findOne({
        SKU: sku,
      });
      const existingImages = existingRoboProduct.sideImage.length;
      const remainingImages = 5 - existingImages;

      if (remainingImages <= 0) {
        throw new BadRequestException(
          `Already uploaded maximum images for SKU: ${sku}`,
        );
      }

      if (uploadedFiles.length > remainingImages) {
        throw new BadRequestException(
          `Only ${remainingImages} images can be uploaded for SKU: ${sku}`,
        );
      }

      for (const file of uploadedFiles) {
        // Check the file size
        const fileSizeInKB = Math.round(file.size / 1024); // Convert file size to KB
        if (fileSizeInKB > 100) {
          throw new BadRequestException('File size exceeds 100 KB limit');
        }

        const filePath = `/${Date.now()}/${sku}/${file.originalname}`;
        const folderPath = `${process.env.IMAGEKIT_FOLDER}/Products/${sku}`;

        const uploadResponse = await imagekit.upload({
          file: file.buffer,
          fileName: filePath,
          folder: folderPath,
        });

        const lowQualityUrl = imagekit.url({
          path: uploadResponse.filePath,
          transformation: [
            {
              quality: '10', // Adjust the quality value as desired
            },
          ],
        });

        const mediumQualityUrl = imagekit.url({
          path: uploadResponse.filePath,
          transformation: [
            {
              quality: '50', // Adjust the quality value as desired
            },
          ],
        });

        const highQualityUrl = imagekit.url({
          path: uploadResponse.filePath,
          transformation: [
            {
              quality: '100', // Request the highest available quality
            },
          ],
        });

        sideImages.push({
          lowUrl: lowQualityUrl,
          mediumUrl: mediumQualityUrl,
          highUrl: highQualityUrl,
          fileId: uploadResponse.fileId,
        });
      }

      if (!existingRoboProduct.mainImage) {
        const updateImages = await this.roboProductsModel.findOneAndUpdate(
          { SKU: sku },
          {
            $set: {
              sideImage: [...existingRoboProduct.sideImage, ...sideImages],
              mainImage: sideImages[0],
            },
          },
        );
        return res.status(200).send({ status: 'success', images: sideImages });
      }
      const updateImages = await this.roboProductsModel.findOneAndUpdate(
        { SKU: sku },
        {
          $set: {
            sideImage: [...existingRoboProduct.sideImage, ...sideImages],
          },
        },
      );

      res.status(200).send({ status: 'success', images: sideImages });
    } catch (error) {
      // console.log(error);
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // delete side images with main image
  async deleteSideImage(sku: string, res: Response, req: Request) {
    try {
      const fileId = req.body.fileId;
      if (!fileId) {
        throw new NotFoundException('fileId is required');
      }

      const roboProduct = await this.roboProductsModel.findOne({ SKU: sku });
      if (!roboProduct) {
        throw new NotFoundException(`SKU: ${sku} not found`);
      }

      const updatedSideImages = roboProduct.sideImage.filter(
        (image) => image.fileId !== fileId,
      );

      // Check if the fileId exists in sideImage array
      if (updatedSideImages.length === roboProduct.sideImage.length) {
        throw new NotFoundException(
          `FileId ${fileId} not found in sideImage  for SKU: ${sku}`,
        );
      }

      // Update the roboProduct in the database with the updated sideImage array
      await this.roboProductsModel.findOneAndUpdate(
        { SKU: sku },
        { $set: { sideImage: updatedSideImages } },
      );

      if (fileId) {
        // Update the mainImage if it exists and has the same fileId
        if (roboProduct.mainImage && roboProduct.mainImage.fileId === fileId) {
          await this.roboProductsModel.findOneAndUpdate(
            { SKU: sku },
            { $unset: { mainImage: 1 } },
          );

          if (updatedSideImages.length > 0) {
            const firstImage = updatedSideImages[0];

            // Set the first image from sideImage as the new mainImage
            await this.roboProductsModel.findOneAndUpdate(
              { SKU: sku },
              { $set: { mainImage: firstImage } },
            );
          }
        }
      }

      try {
        // Delete the file associated with the fileId
        await imagekit.deleteFile(fileId);
        // console.log('File deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        // Handle the error accordingly
      }

      res.status(200).send({
        status: 'success',
        message: 'Side image deleted successfully',
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  async getProductStatusExcel(req: Request, res: Response) {
    try {
      const { data, columns } = req.body;
      const defaultColumns = [
        'Quantity',
        'GST',
        'MRP',
        'LandingCost',
        'SalesPrice',
        'SellerPrice',
      ];
      if (!data) {
        throw new NotFoundException('Invalid Data');
      }

      if (columns && columns.length > 0) {
        const invalidColumns = columns.filter(
          (column) => !defaultColumns.includes(column),
        );
        if (invalidColumns.length > 0) {
          throw new NotFoundException(
            `Invalid Columns: ${invalidColumns.join(', ')}`,
          );
        }
      }

      const products = await this.roboProductsModel.find({
        SKU: { $in: data },
      });
      if (products.length === 0) {
        throw new NotFoundException('No Product Found');
      }

      const processedProduct = products.map((item) => {
        const product = {
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
        };

        if (!columns || columns.length === 0) {
          defaultColumns.forEach((column) => {
            if (column === 'Quantity') {
              product[column] =
                item['ActualQuantity'] !== undefined
                  ? item['ActualQuantity']
                  : 0;
              return;
            }
            product[column] = item[column] !== undefined ? item[column] : 0;
          });
        } else {
          columns.forEach((column) => {
            if (column === 'Quantity') {
              product[column] =
                item['ActualQuantity'] !== undefined
                  ? item['ActualQuantity']
                  : 0;
              return;
            }
            product[column] = item[column] !== undefined ? item[column] : 0;
          });
        }

        return product;
      });

      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Product Status');

      const columnHeaders = [
        { header: 'SKU', key: 'SKU', width: 18 },
        { header: 'Name', key: 'Name', width: 55 },
        { header: 'Brand', key: 'Brand', width: 20 },
      ];

      if (!columns || columns.length === 0) {
        defaultColumns.forEach((column) => {
          columnHeaders.push({ header: column, key: column, width: 20 });
        });
      } else {
        columns.forEach((column) => {
          columnHeaders.push({ header: column, key: column, width: 20 });
        });
      }

      worksheet.columns = columnHeaders;
      worksheet.addRows(processedProduct);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=product_status.xlsx',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      await workbook.xlsx.write(res);

      res.status(200).end();
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // make default images by admin
  async makeDefaultImage(sku: string, res: Response, req: Request) {
    try {
      const { defaultImage } = req.body;
      const product = await this.roboProductsModel.findOne({ SKU: sku });
      if (!product) {
        throw new BadRequestException('Product not found');
      }
      product.mainImage = defaultImage;
      await product.save();
      res
        .status(201)
        .send({ status: 'success', message: 'Default Image successfully set' });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }
  // get Product Approval Count
  async productApprovalCount(res: Response, req: Request) {
    try {
      const countQuery = {
        $or: [
          { isVerifiedQuantity: false },
          { isVerifiedSalesPrice: false },
          { isVerifiedSellerPrice: false },
          { isVerifiedLandingCost: false },
          { isVerifiedMRP: false },
        ],
      };

      const counts = await this.roboProductsModel.aggregate([
        { $match: countQuery },
        {
          $group: {
            _id: null,
            'Stock Approval': {
              $sum: { $cond: [{ $eq: ['$isVerifiedQuantity', false] }, 1, 0] },
            },
            'SalesPrice Approval': {
              $sum: {
                $cond: [{ $eq: ['$isVerifiedSalesPrice', false] }, 1, 0],
              },
            },
            'SellerPrice Approval': {
              $sum: {
                $cond: [{ $eq: ['$isVerifiedSellerPrice', false] }, 1, 0],
              },
            },
            'Cost Approval': {
              $sum: {
                $cond: [{ $eq: ['$isVerifiedLandingCost', false] }, 1, 0],
              },
            },
            'MRP Approval': {
              $sum: { $cond: [{ $eq: ['$isVerifiedMRP', false] }, 1, 0] },
            },
          },
        },
        { $project: { _id: 0 } },
      ]);

      const result =
        counts.length > 0
          ? counts[0]
          : {
              'Stock Approval': 0,
              'SalesPrice Approval': 0,
              'SellerPrice Approval': 0,
              'Cost Approval': 0,
              'MRP Approval': 0,
            };

      return res.status(200).send({
        status: 'success',
        message: 'Fetched unApproved Count',
        data: result,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  /// regex search
  async searchRegex(res: Response, query: any) {
    try {
      const { searchTerm } = query;

      let regexPattern = searchTerm
        .split(' ')
        .map((term) => `(?=.*${term})`)
        .join('');

      let result = await this.roboProductsModel
        .find({
          Name: {
            $regex: new RegExp(regexPattern, 'i'), // "i" for case-insensitive search
          },
        })
        .select('Name SKU')
        .exec();

      // Calculate the count from the length of the aggregation result array
      const count = result.length;
      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        count: count,
        data: result,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // MongoDB Atlas Full-Text Search query
  async searchIndex(res: Response, query: any) {
    try {
      const { searchTerm } = query;

      const searchQuery = [
        {
          $search: {
            index: 'searchRoboProducts',
            text: {
              query: searchTerm,
              path: 'Name',
            },
          },
        },
      ];

      // Execute the aggregation using .exec() and collect the results in an array
      const aggregationResult = await this.roboProductsModel
        .aggregate(searchQuery)
        .exec();

      // Calculate the count from the length of the aggregation result array
      const count = aggregationResult.length;

      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        count: count,
        data: aggregationResult,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  async indexAutoCompleteAdmin(res: Response, query: any) {
    try {
      const { searchTerm } = query;

      const searchQuery = [
        {
          $search: {
            index: 'searchRoboProducts',
            text: {
              query: searchTerm,
              path: 'Name',
              fuzzy: {},
            },
          },
        },
        {
          $limit: 30,
        },
        {
          $project: {
            Name: 1,
            SKU: 1,
            mainImage: 1,
          },
        },
      ];

      // Execute the aggregation using .exec() and collect the results in an array
      const aggregationResult = await this.roboProductsModel
        .aggregate(searchQuery)
        .exec();

      // Calculate the count from the length of the aggregation result array
      const count = aggregationResult.length;

      res.status(200).send({
        status: 'success',
        message: 'Data successfully fetched',
        count: count,
        data: aggregationResult,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // brand aaddition by admin
  async addBrand(files: any, res: Response, req: Request) {
    try {
      const uploadedFiles = files.Images || [];
      const { brandName } = req.body;

      if (!brandName || uploadedFiles.length === 0) {
        throw new BadRequestException('BrandName and Images are required');
      }

      const brandId = `BID${generateRandomNumber(4)}`;

      const filePath = `/${Date.now()}/${brandId}/${
        uploadedFiles[0].originalname
      }`;
      const folderPath = `${process.env.IMAGEKIT_FOLDER}/Brands/${brandId}`;

      const uploadResponse = await imagekit.upload({
        file: uploadedFiles[0].buffer,
        fileName: filePath,
        folder: folderPath,
      });

      const brand = new this.BrandModel({
        BrandId: brandId,
        BrandName: brandName,
        BrandImage: { fileId: uploadResponse.fileId, url: uploadResponse.url }, // Assuming you want to store the first image as the main image
      });

      await brand.save();

      res.status(201).send({
        status: 'success',
        message: 'Brand added successfully',
        brand: brand,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBrand(res: Response) {
    try {
      const brand = await this.BrandModel.find();
      res
        .status(200)
        .send({ message: 'Brand retrieved successfully', brand: brand });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateBrand(files: any, res: Response, req: Request) {
    try {
      const uploadedFiles = files.Images || [];
      const { brandName, id } = req.body;
      // if (!brandName || uploadedFiles.length === 0) {
      //   throw new BadRequestException('BrandName and Images are required');
      // }
      const findBrand = await this.BrandModel.findOne({ BrandId: id });

      if (!findBrand) {
        throw new NotFoundException('Brand not found');
      }

      if (findBrand?.BrandImage?.fileId) {
        await imagekit.deleteFile(findBrand.BrandImage.fileId);
      }

      if (uploadedFiles.length != 0) {
        const filePath = `/${Date.now()}/${findBrand.BrandId}/${
          uploadedFiles[0].originalname
        }`;
        const folderPath = `${process.env.IMAGEKIT_FOLDER}/Brands/${findBrand.BrandId}`;
        const uploadResponse = await imagekit.upload({
          file: uploadedFiles[0].buffer,
          fileName: filePath,
          folder: folderPath,
        });
        findBrand.BrandImage = {
          fileId: uploadResponse.fileId,
          url: uploadResponse.url,
        };
      }
      findBrand.BrandName = brandName;
      await findBrand.save();
      res
        .status(200)
        .send({ message: 'Brand updated successfully', brand: findBrand });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteBrand(id, res) {
    try {
      const findBrand = await this.BrandModel.findOne({ BrandId: id });
      if (!findBrand) {
        throw new NotFoundException('Brand not found');
      }

      const fileIdToDelete = findBrand.BrandImage?.fileId;

      if (fileIdToDelete) {
        await imagekit.deleteFile(fileIdToDelete);
        await this.BrandModel.deleteOne({ BrandId: id });
        res
          .status(200)
          .send({ message: 'Brand and associated image deleted successfully' });
      } else {
        await this.BrandModel.deleteOne({ BrandId: id });
        res.status(200).send({ message: 'Brand deleted successfully' });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /// Calc service

  async addCalc(req: Request, res: Response) {
    try {
      const { data } = req.body;

      const newCalc = await this.CalcModel.create(data);

      res.send({
        success: true,
        messsage: 'Calc data saved successfully added',
        data: newCalc,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCalc(req: Request, res: Response) {
    try {
      const calcData = await this.CalcModel.find()
        .select('CalcId _id description Product createdAt ')
        .sort('-updatedAt');

      res.send({
        success: true,
        messsage: 'Calc data Fetched successfully',
        data: calcData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCalcById(params: any, res: Response) {
    try {
      const calcData: any = await this.CalcModel.findById(params).exec();

      if (!calcData) {
        return res.send({
          success: false,
          messsage: 'Calc not found',
        });
      }

      const newUpdatedProduct = await Promise.all(
        calcData.Product.map(async (item) => {
          const sku = item.SKU;

          // Use the select method to specify the field you want (Landing Cost)
          const landingCost = await this.roboProductsModel
            .findOne({ SKU: sku })
            .select('LandingCost');

          return { ...item, LandingCost: landingCost.LandingCost };
        }),
      );

      const newCalc = calcData.toObject();

      return res.send({
        success: true,
        messsage: 'Calc data Fetched for one successfully',
        data: { ...newCalc, Product: newUpdatedProduct },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateCalcById(params: any, res: Response, req: Request) {
    try {
      const { data } = req.body;

      if (!data) {
        res.status(404).send({
          status: 'error',
          message: 'Data not found',
        });
        return;
      }
      const calcData = await this.CalcModel.findById(params);

      if (!calcData) {
        return res.status(404).send({
          success: false,
          messsage: 'Calc not found',
        });
      }

      calcData.Product = data.Product;
      calcData.weightState = data.weightState;
      calcData.shippingState = data.shippingState;
      calcData.priceState = data.priceState;
      calcData.otherChargeState = data.otherChargeState;
      calcData.finalCalcTotal = data.finalCalcTotal;

      const newData = await calcData.save();
      return res.send({
        success: true,
        messsage: 'Calc data updated successfully',
        data: newData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
