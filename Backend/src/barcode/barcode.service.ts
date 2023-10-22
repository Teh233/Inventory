import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  DeleteBarcodeDto,
  DeleteBarcodeInBulkDto,
  GenerateBarcodeDto,
  ReturnBarcodeDto,
  verifyProductDto,
} from './dto/create-barcode.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  BarcodeGen,
  BarcodeHistory,
  BarcodeReturn,
  SalesHistory,
} from './schema/barcode.schema';
import { Model, mongo } from 'mongoose';
import { roboproducts } from 'src/robo-products/schema/robo-products.schema';
import { generateSerialNumbers } from 'src/common/utils/common.utils';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { find } from 'rxjs';
import { Customer } from './schema/customer.schema';

@Injectable()
export class BarcodeService {
  constructor(
    @InjectModel(BarcodeGen.name)
    public BarcodeGenModel: Model<BarcodeGen>,
    @InjectModel(roboproducts.name)
    private roboproductsModel: Model<roboproducts>,
    @InjectModel(BarcodeHistory.name)
    private barcodeHistoryModel: Model<BarcodeHistory>,
    @InjectModel(BarcodeReturn.name)
    private barcodeReturnModel: Model<BarcodeReturn>,
    @InjectModel(SalesHistory.name)
    private SalesHistoryModel: Model<SalesHistory>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
  ) {}

  // generate and save the barcode
  async create(createBarcodeDto: GenerateBarcodeDto, res) {
    try {
      const { SKUs } = createBarcodeDto;
      const existingBarcodes = await this.BarcodeGenModel.find({
        SKU: { $in: SKUs },
      });
      const existingSKUs = existingBarcodes.map((barcode) => barcode.SKU);

      const newSKUs = SKUs.filter((sku) => !existingSKUs.includes(sku));

      const products = await this.roboproductsModel.find({
        SKU: { $in: newSKUs },
      });

      if (!products || products.length === 0) {
        throw new BadRequestException('Product not found');
      }
      const skuSerialNumbers = [];
      for (const product of products) {
        const { SKU, Quantity } = product;
        const serialNumbers = generateSerialNumbers(SKU, '001', Quantity);
        skuSerialNumbers.push({ SKU, serialNumbers });

        const newBarcode = new this.BarcodeGenModel({
          SKU,
          SNo: serialNumbers,
        });
        await newBarcode.save();
      }

      res.status(201).send({
        status: 'success',
        message: 'Barcode Number Generated Successfully',
        data: skuSerialNumbers,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // download excel file wiht serial numbeers
  async allBarcodeInExcel(allSkus: GenerateBarcodeDto, res) {
    try {
      const { SKUs } = allSkus;

      const barcodes = await this.BarcodeGenModel.find({ SKU: { $in: SKUs } });

      if (!barcodes || barcodes.length === 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No barcodes found',
        });
      }

      const data = [
        [
          'Barcode Value',
          'Print Qty',
          'Text Line 1 (optional)',
          'Text Line 2 (optional)',
          'Text Line 3 (optional)',
          'Text Line 4 (optional)',
        ],
      ];
      barcodes.forEach((barcode) => {
        barcode.SNo.forEach((sn) => {
          if (!sn.isProcessed && !sn.isRejected) {
            // Exclude if isProcessed is true
            data.push([sn.serialNumber, '1']);
          }
        });

        data.push(['', '1']);
      });
      data.pop();
      const worksheet = xlsx.utils.aoa_to_sheet(data);
      const workbook = xlsx.utils.book_new();

      // Set column width
      const columnWidths = [
        { wpx: 150 },
        { wpx: 60 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
      ];
      worksheet['!cols'] = columnWidths;

      xlsx.utils.book_append_sheet(workbook, worksheet, 'Barcodes');

      const excelBuffer = xlsx.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });

      const filePath = 'barcodes.xlsx';
      fs.writeFileSync(filePath, excelBuffer);

      res.download(filePath, 'barcodes.xlsx', (err) => {
        if (err) {
          // console.log(err);
          res
            .status(500)
            .send({ status: 'error', message: 'Error while downloading file' });
        }

        // Remove the file after download
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // delete a single barcode
  async deleteBarcode(Sno: DeleteBarcodeDto, res): Promise<void> {
    try {
      const { SNo } = Sno;
      const sku = SNo.slice(0, -3);
      const existingBarcode = await this.BarcodeGenModel.findOne({ SKU: sku });
      const findSNo = existingBarcode.SNo.map((item) => item.serialNumber);
      const isSNoExists = findSNo.includes(SNo);
      if (!isSNoExists) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No barcodes found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const delSerialNo = await this.BarcodeGenModel.findOneAndUpdate(
        { SKU: sku },
        { $pull: { SNo: { serialNumber: SNo } } },
        { new: true },
      );
      if (!delSerialNo) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Error Occurred While Deleting',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const product: any = await this.roboproductsModel.findOne({ SKU: sku });
      product.Quantity -= 1;
      await product.save();
      res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Barcode and Quantity reduced successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get a single sku's all barcode
  async getAllBarcodeOfSingleSku(id: string, res) {
    try {
      const product = await this.roboproductsModel.findOne({ SKU: id });
      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No Product found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const barcode = await this.BarcodeGenModel.findOne({ SKU: id });
      if (!barcode) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No Barcode found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const serialNumbers = barcode.SNo;
      const products = {
        sku: id,
        name: product.Name,
      };
      res.status(200).send({
        status: 'success',
        message: 'Serial numbers fetched successfully',
        data: serialNumbers,
        products,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all barocodes
  async getAllBarcodes(res) {
    try {
      const barcodes = await this.BarcodeGenModel.find({}).sort({
        updatedAt: -1,
      });
      const skus = barcodes.map((item) => item.SKU);
      if (!barcodes) {
        throw new HttpException(
          {
            status: 'error',
            message: 'No Barcodes found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'All Barcodes found',
        allData: barcodes,
        data: skus,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // delete barocodes in bulk it is for dispatch items
  // async dispatchBarcodeInBulk(deleteBarcodes: DeleteBarcodeInBulkDto, res) {
  //   try {
  //     const { barcodes } = deleteBarcodes;
  //     const skuSet = new Set<string>(); // Create a Set to store unique SKUs

  //     for (let barcode of barcodes) {
  //       const { SKU, Sno } = barcode;
  //       skuSet.add(SKU); // Add SKU to the Set

  //       const existingBarcode = await this.BarcodeGenModel.findOne({
  //         SKU: SKU,
  //       });
  //       if (!existingBarcode) {
  //         throw new HttpException(
  //           `Barcode not found for SKU: ${SKU}`,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       let snoCount = 0;

  //       for (let sno of Sno) {
  //         const snoIndex = existingBarcode.SNo.findIndex(
  //           (item) => item.serialNumber === sno,
  //         );

  //         const findStatus = existingBarcode.SNo.find(
  //           (item) => item.serialNumber === sno,
  //         );
  //         if (snoIndex !== -1 && findStatus.isProcessed === false) {
  //           throw new HttpException(
  //             `Barcode Not sticked for ${sno}`,
  //             HttpStatus.NOT_FOUND,
  //           );
  //         }
  //         if (snoIndex !== -1) {
  //           existingBarcode.SNo.splice(snoIndex, 1);
  //           snoCount++;
  //         } else {
  //           throw new HttpException(
  //             `Serial No ${sno} not found`,
  //             HttpStatus.NOT_FOUND,
  //           );
  //         }
  //       }

  //       if (snoCount > 0) {
  //         await existingBarcode.save();
  //       }
  //     }

  //     // Generate history for each unique SKU in the Set
  //     for (let sku of skuSet) {
  //       const snoList = barcodes
  //         .filter((barcode) => barcode.SKU === sku)
  //         .flatMap((barcode) => barcode.Sno);

  //       this.generateHistory(sku, snoList); // Assuming generateHistory function is available
  //     }

  //     const skuList = barcodes.map((barcode) => barcode.SKU);
  //     const products: any = await this.roboproductsModel.find({
  //       SKU: { $in: skuList },
  //     });

  //     for (let product of products) {
  //       const sku = product.SKU;
  //       const skuBarcodes = barcodes.filter((barcode) => barcode.SKU === sku);
  //       let skuSnoCount = 0;

  //       for (let barcode of skuBarcodes) {
  //         skuSnoCount += barcode.Sno.length;
  //       }

  //       product.Quantity -= skuSnoCount;
  //       product.ActualQuantity -= skuSnoCount;
  //       await product.save();
  //     }

  //     res.status(HttpStatus.OK).send({
  //       status: 'success',
  //       message: 'Barcodes and quantities updated successfully',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // // generate history function which is being usd in delete barcode in bulk
  // async generateHistory(sku: string, snoList: any[]) {
  //   try {
  //     let barcodeHistory = await this.barcodeHistoryModel.findOne({ SKU: sku });

  //     let product = await this.roboproductsModel
  //       .findOne({ SKU: sku })
  //       .select('Name Brand MRP');

  //     if (!barcodeHistory) {
  //       barcodeHistory = new this.barcodeHistoryModel({
  //         SKU: sku,
  //         SNo: [],
  //         Name: product.Name,
  //         Brand: product.Brand,
  //         MRP: product.MRP,
  //       });
  //     }
  //     snoList.forEach((serialNumber) => {
  //       barcodeHistory.SNo.push({ serialNumber, dispatchedAt: new Date() }); // Use new Date() to set the current date
  //     });

  //     await barcodeHistory.save();
  //     return 'Barcode History generated successfully';
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // }

  async dispatchBarcodeInBulk(deleteBarcodes, res) {
    try {
      const { barcodes, CustomerName, MobileNo, InvoiceNo } = deleteBarcodes;

      // Create a Set to store unique SKUs
      const skuSet = new Set<string>();

      // Array to store all sno values
      const snoArray: string[] = [];

      // Loop through each barcode in the input
      for (const barcode of barcodes) {
        const { SKU, Sno } = barcode;

        // Add the SKU to the Set of unique SKUs
        skuSet.add(SKU);

        // Add sno values to the snoArray
        snoArray.push(...Sno);

        // Find the existing barcode
        const existingBarcode = await this.BarcodeGenModel.findOne({ SKU });

        if (!existingBarcode) {
          throw new HttpException(
            `Barcode not found for SKU: ${SKU}`,
            HttpStatus.NOT_FOUND,
          );
        }

        let snoCount = 0;

        // Loop through each sno in the current barcode
        for (const sno of Sno) {
          const snoIndex = existingBarcode.SNo.findIndex(
            (item: { serialNumber: string }) => item.serialNumber === sno,
          );
          const findStatus = existingBarcode.SNo.find(
            (item: { serialNumber: string; isProcessed: boolean }) =>
              item.serialNumber === sno,
          );

          if (snoIndex !== -1 && !findStatus.isProcessed) {
            throw new HttpException(
              `Barcode Not sticked for ${sno}`,
              HttpStatus.NOT_FOUND,
            );
          }

          if (snoIndex !== -1) {
            // Save sub value before removing the data
            const snoObj = existingBarcode.SNo[snoIndex];
            const subValue = snoObj.sub;

            // Remove the entry from existingBarcode
            existingBarcode.SNo.splice(snoIndex, 1);
            snoCount++;

            // Generate history for this SKU, sno, and sub value
            await this.generateHistory(SKU, sno, subValue);
          } else {
            throw new HttpException(
              `Serial No ${sno} not found`,
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (snoCount > 0) {
          await existingBarcode.save();
        }
      }
      // Update product quantities
      const skuList = barcodes.map((barcode) => barcode.SKU);
      const products = await this.roboproductsModel.find({
        SKU: { $in: skuList },
      });

      for (const product of products) {
        const sku = product.SKU;
        const skuBarcodes = barcodes.filter((barcode) => barcode.SKU === sku);
        let skuSnoCount = 0;

        for (const barcode of skuBarcodes) {
          skuSnoCount += barcode.Sno.length;
        }

        product.Quantity -= skuSnoCount;
        product.ActualQuantity -= skuSnoCount;
        await product.save();
      }

      // Create sales history entry
      await this.SalesHistoryModel.create({
        CustomerName,
        MobileNo,
        InvoiceNo,
        Barcode: snoArray,
      });

      // Send success response
      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Barcodes and quantities updated successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateHistory(sku: string, serialNumber: string, subValue: any) {
    try {
      // Find existing history or create a new one
      let barcodeHistory = await this.barcodeHistoryModel.findOne({ SKU: sku });
      if (!barcodeHistory) {
        const product = await this.roboproductsModel.findOne({ SKU: sku });
        barcodeHistory = new this.barcodeHistoryModel({
          SKU: sku,
          SNo: [],
          Name: product.Name,
          Brand: product.Brand,
          MRP: product.MRP,
        });
      }

      // Push the new history entry with sub value
      barcodeHistory.SNo.push({
        serialNumber,
        dispatchedAt: new Date(),
        sub: subValue,
      });

      await barcodeHistory.save();
      return 'Barcode History generated successfully';
    } catch (err) {
      console.log(err.message);
    }
  }

  // get all barcode dispatched history
  async getBarcodeHistory(res) {
    try {
      const dispatchHistory = await this.barcodeHistoryModel
        .find({})
        .sort({ updatedAt: -1 });
      if (!dispatchHistory) {
        throw new HttpException(
          { status: 'error', message: 'Dispatch History Not Found' },
          HttpStatus.NOT_FOUND,
        );
      }
      res.status(HttpStatus.OK).send({
        status: 'success',
        messsage: 'BarcodeHistory successfully retrieved',
        data: dispatchHistory,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // return barcode or product
  // async returnBarcode(returnBacode: ReturnBarcodeDto, res): Promise<any> {
  //   try {
  //     const { barcodes } = returnBacode;
  //     const barcodeReturns: BarcodeReturn[] = [];

  //     for (const barcode of barcodes) {
  //       const { SKU, Sno } = barcode;
  //       const product = await this.roboproductsModel.findOne({ SKU: SKU });
  //       const barcodeGen = await this.BarcodeGenModel.findOne({ SKU: SKU });
  //       console.log('barcodeGen', barcodeGen);
  //       if (!product) {
  //         return res
  //           .status(HttpStatus.NOT_FOUND)
  //           .send({ status: 'error', message: 'Product not found' });
  //       }

  //       const name = product.Name;
  //       const brand = product.Brand;

  //       for (const sno of Sno) {
  //         // Check if a BarcodeReturn document with the given SKU already exists
  //         const existingBarcodeReturn = await this.barcodeReturnModel.findOne({
  //           SKU: SKU,
  //         });
  //         const barcodeHistory = await this.barcodeHistoryModel.findOne({
  //           'SNo.serialNumber': sno,
  //         });
  //         console.log('barcodeHistory', barcodeHistory);

  //         if (!existingBarcodeReturn) {
  //           // Create a new BarcodeReturn instance if it doesn't exist
  //           const barcodeReturn = new this.barcodeReturnModel();
  //           barcodeReturn.SKU = SKU;
  //           barcodeReturn.Name = name;
  //           barcodeReturn.Brand = brand;
  //           barcodeReturn.type = 'Return';
  //           barcodeReturn.SNo.push({
  //             serialNumber: sno,
  //             returnedAt: new Date(),
  //           });
  //           const savedBarcodeReturn = await barcodeReturn.save();
  //           barcodeReturns.push(savedBarcodeReturn);
  //         } else {
  //           // Push sno into the existing SNo array of the BarcodeReturn
  //           existingBarcodeReturn.SNo.push({
  //             serialNumber: sno,
  //             returnedAt: new Date(),
  //           });
  //           const updatedBarcodeReturn = await existingBarcodeReturn.save();
  //           barcodeReturns.push(updatedBarcodeReturn);
  //         }

  //         // Push sno into the barcodegen collection
  //         if (barcodeGen) {
  //           barcodeGen.SNo.push({
  //             serialNumber: sno,
  //             createdAt: new Date(),
  //             isProcessed: true,
  //             sub: [],
  //             isRejected: false,
  //           });
  //           await barcodeGen.save();
  //         }
  //       }

  //       // Update roboproductsModel quantity
  //       const quantityIncrease = Sno.length;
  //       product.Quantity = (product.Quantity || 0) + quantityIncrease;
  //       product.ActualQuantity =
  //         (product.ActualQuantity || 0) + quantityIncrease;
  //       await product.save();

  //       // console.log('Updated roboproductsModel:', product);
  //     }

  //     res.status(201).send({
  //       status: 'success',
  //       message: 'Barcode Returned Successfully',
  //       returnedBarcode: barcodeReturns,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async returnBarcode(returnBacode: ReturnBarcodeDto, res): Promise<any> {
    try {
      const { barcodes } = returnBacode;
      const barcodeReturns: BarcodeReturn[] = [];

      for (const barcode of barcodes) {
        const { SKU, Sno } = barcode;
        const product = await this.roboproductsModel.findOne({ SKU: SKU });
        const barcodeGen = await this.BarcodeGenModel.findOne({ SKU: SKU });
        if (!product) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .send({ status: 'error', message: 'Product not found' });
        }

        const name = product.Name;
        const brand = product.Brand;

        for (const sno of Sno) {
          const existingBarcodeReturn = await this.barcodeReturnModel.findOne({
            SKU: SKU,
          });
          const barcodeHistory = await this.barcodeHistoryModel.findOne({
            'SNo.serialNumber': sno,
          });

          if (!existingBarcodeReturn) {
            // Create a new BarcodeReturn instance if it doesn't exist
            const barcodeReturn = new this.barcodeReturnModel();
            barcodeReturn.SKU = SKU;
            barcodeReturn.Name = name;
            barcodeReturn.Brand = brand;
            barcodeReturn.type = 'Return';
            barcodeReturn.SNo.push({
              serialNumber: sno,
              returnedAt: new Date(),
            });
            const savedBarcodeReturn = await barcodeReturn.save();
            barcodeReturns.push(savedBarcodeReturn);
          } else {
            // Push sno into the existing SNo array of the BarcodeReturn
            existingBarcodeReturn.SNo.push({
              serialNumber: sno,
              returnedAt: new Date(),
            });
            const updatedBarcodeReturn = await existingBarcodeReturn.save();
            barcodeReturns.push(updatedBarcodeReturn);
          }

          // Push sno into the barcodegen collection
          if (barcodeGen) {
            const subValue =
              barcodeHistory?.SNo.find((s) => s.serialNumber === sno)?.sub ||
              [];
            barcodeGen.SNo.push({
              serialNumber: sno,
              createdAt: new Date(),
              isProcessed: true,
              sub: subValue,
              isRejected: false,
            });
            await barcodeGen.save();
          }

          // // update sales history
          // const saleshistory = await this.SalesHistoryModel.findOne({Barcode:sno})
          // const deleteBarcode = saleshistory.Barcode
          // console.log(deleteBarcode)
        }

        // Update roboproductsModel quantity
        const quantityIncrease = Sno.length;
        product.Quantity = (product.Quantity || 0) + quantityIncrease;
        product.ActualQuantity =
          (product.ActualQuantity || 0) + quantityIncrease;
        await product.save();
      }

      res.status(201).send({
        status: 'success',
        message: 'Barcode Returned Successfully',
        returnedBarcode: barcodeReturns,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all return barcode history
  async getAllReturnBarcodeHistory(res) {
    try {
      const returnBarcode = await this.barcodeReturnModel
        .find({})
        .sort({ updatedAt: -1 });
      if (!returnBarcode) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Return barcode not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Return barcode successfully fetched',
        data: returnBarcode,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // verify product barcode
  async verifyProductBarcode(verifyProduct: verifyProductDto, res) {
    try {
      const { Sno } = verifyProduct;
      if (!Sno) {
        throw new HttpException(
          { status: 'error', message: 'Barcode is required' },
          HttpStatus.NOT_FOUND,
        );
      }
      await this.BarcodeGenModel.updateMany(
        { 'SNo.serialNumber': { $in: Sno } },
        { $set: { 'SNo.$[elem].isProcessed': true } },
        { arrayFilters: [{ 'elem.serialNumber': { $in: Sno } }] },
      );

      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Product Barcode verified successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update barcode like it will create barcode in both case
  async updateBarcode(id: string, qty: any) {
    try {
      const SKU = id;
      const Quantity = qty;
      const barcodeGen = await this.BarcodeGenModel.findOne({ SKU: SKU });
      const barcodeHistory = await this.barcodeHistoryModel.findOne({
        SKU: SKU,
      });
      if (!barcodeGen) {
        const serialNumbers = generateSerialNumbers(SKU, '001', Quantity);
        const updateBarcodegen = await this.BarcodeGenModel.create({
          SKU: SKU,
          SNo: serialNumbers,
        });
        // console.log('Barcode Generated Successfully');
        return {
          status: 'success',
          message: 'Barcode processed successfully',
          data: updateBarcodegen,
        };
      }
      let maxSerialNo = '0';
      barcodeGen.SNo.forEach((snoObj) => {
        const serialNumber = snoObj.serialNumber;

        if (serialNumber > maxSerialNo) {
          maxSerialNo = serialNumber;
        }
      });
      if (barcodeHistory) {
        barcodeHistory.SNo.forEach((snoObj) => {
          const serialNumber = snoObj.serialNumber;

          if (serialNumber > maxSerialNo) {
            maxSerialNo = serialNumber;
          }
        });
      }
      // Store the maximum serial number in a variable
      const storedMaxSerialNo = maxSerialNo;
      const startingDigits: any = parseInt(storedMaxSerialNo.slice(-3)) + 1;
      const newSerialNumbers: any = generateSerialNumbers(
        SKU,
        startingDigits,
        Quantity,
      );
      barcodeGen.SNo.push(...newSerialNumbers);
      await barcodeGen.save();
      console.log('barcode updated successfully with respect to quantity');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // scan barcode for product verify finder
  async searchBarcodeForVerifyProduct(searchProduct, res) {
    const { Sno } = searchProduct;
    if (!Sno) {
      throw new BadRequestException('Serial number is required');
    }

    // Find the sticker with the provided serial number
    const existingSticker = await this.BarcodeGenModel.findOne({
      'SNo.serialNumber': Sno,
    });

    if (!existingSticker) {
      return res.status(404).json({
        status: 'error',
        message: 'Sticker not found for the provided serial number',
      });
    }
    const snoArray = existingSticker.SNo;
    const particularSno: any = snoArray.find((sno) => sno.serialNumber === Sno);

    if (particularSno && particularSno.isRejected) {
      return res.status(404).json({
        status: 'error',
        message: 'Barocode Rejected cannot be Verified or sticked',
      });
    }

    const snoIndex = existingSticker.SNo.findIndex(
      (snoObj) => snoObj.serialNumber === Sno,
    );

    if (snoIndex === -1) {
      throw new HttpException(
        { message: 'Barcode Not Found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const isProcessed = existingSticker.SNo[snoIndex].isProcessed;

    if (isProcessed) {
      return res.status(400).send({
        status: 'error',
        message: 'Sticker is already processed',
      });
    }
    const { SKU } = existingSticker;
    const product = await this.roboproductsModel
      .findOne({ SKU })
      .select('SKU Name Brand Weight mainImage ActualQuantity');

    // Perform the updateMany operation to set 'isProcessed' to true for the provided serial number
    await this.BarcodeGenModel.updateMany(
      { 'SNo.serialNumber': Sno },
      { $set: { 'SNo.$[elem].isProcessed': true } },
      { arrayFilters: [{ 'elem.serialNumber': Sno }] },
    );

    const barcodeInfo = {
      serialNumber: existingSticker.SNo[snoIndex].serialNumber,
      createdAt: existingSticker.SNo[snoIndex].createdAt,
      isProcessed: true, // Updated the isProcessed field to true after the update
    };
    const restBarcode = existingSticker.SNo.filter(
      (barcode) => !barcode.isProcessed,
    );
    const restBarcodeLength = restBarcode.length - 1;

    if (product?.ActualQuantity === 0) {
      product.ActualQuantity = 1;
    } else {
      product.ActualQuantity += 1;
    }
    await product.save();
    const info = {
      product,
      barcode: barcodeInfo,
      restBarcode: restBarcodeLength,
    };

    res.status(200).send({
      status: 'success',
      message: 'Barcode processed successfully',
      data: info,
    });
  }

  // scan barcode to chechk if product can be dispatched
  async verifyBarcodeForDispatch(searchProduct, res) {
    try {
      const { Sno } = searchProduct;
      if (!Sno) {
        throw new BadRequestException('Barcode is required');
      }

      const existBarcode = await this.BarcodeGenModel.findOne({
        'SNo.serialNumber': Sno,
      });

      if (!existBarcode) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Barcode not found' });
      }

      const snoIndex = existBarcode.SNo.findIndex(
        (snoObj) => snoObj.serialNumber === Sno,
      );

      if (snoIndex === -1) {
        return res.status(404).send({
          status: 'error',
          message: 'Barcode not verified not found for the provided Barcode',
        });
      }
      // Check if the serial number is processed
      if (!existBarcode.SNo[snoIndex].isProcessed) {
        return res.status(400).send({
          status: 'error',
          message: 'Sticker is not processed',
        });
      }
      const { SKU } = existBarcode;
      const product = await this.roboproductsModel
        .findOne({ SKU })
        .select('Name SKU Brand mainImage MRP Weight');

      const barcodeInfo = {
        serialNumber: existBarcode.SNo[snoIndex].serialNumber,
        createdAt: existBarcode.SNo[snoIndex].createdAt,
        isProcessed: existBarcode.SNo[snoIndex].isProcessed,
        sub: existBarcode.SNo[snoIndex].sub,
      };

      const info = {
        product,
        barcode: barcodeInfo,
      };

      res.status(200).send({
        status: 'success',
        message: 'Product fetched successfully',
        data: info,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // scan barcode to chechk if product can be returned
  async verifyBarcodeForReturn(searchProduct, res) {
    try {
      const { Sno } = searchProduct;
      if (!Sno) {
        throw new BadRequestException('Serial number  is required');
      }

      const existBarcode = await this.barcodeHistoryModel.findOne({
        'SNo.serialNumber': Sno,
      });

      if (!existBarcode) {
        throw new HttpException(
          { message: 'Barcode History not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const chechkIsGen = await this.BarcodeGenModel.findOne({
        'SNo.serialNumber': Sno,
      });

      if (chechkIsGen) {
        throw new HttpException(
          {
            message: `${Sno}Serial number is Already returned and is Ready for dispatch`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const snoIndex = existBarcode.SNo.findIndex(
        (snoObj) => snoObj.serialNumber === Sno,
      );

      if (snoIndex === -1) {
        throw new BadRequestException(
          'Sticker not found for the provided serial number',
        );
      }

      const { SKU } = existBarcode;
      const product = await this.roboproductsModel
        .findOne({ SKU })
        .select('Name SKU Brand mainImage MRP Weight ');

      // for showing the customer details
      const cusotmer: any = await this.SalesHistoryModel.findOne({
        Barcode: Sno,
      });

      const barcodeInfo = {
        serialNumber: existBarcode.SNo[snoIndex].serialNumber,
        dispatchedAt: existBarcode.SNo[snoIndex].dispatchedAt,
        sub: existBarcode.SNo[snoIndex].sub,
        CustomerName: cusotmer?.CustomerName,
        MobileNo: cusotmer?.MobileNo,
        Invoice: cusotmer?.InvoiceNo,
      };

      const info = {
        product,
        barcode: barcodeInfo,
      };

      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Product fetched successfully',
        data: info,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // scan for barcode rejection
  async barcodeForRejection(body: any, res: Response) {
    try {
      const { Sno } = body;
      if (!Sno) {
        throw new BadRequestException('Serial number  is required');
      }
      const chechkIsGen = await this.BarcodeGenModel.findOne({
        'SNo.serialNumber': Sno,
      });
      if (!chechkIsGen) {
        throw new HttpException(
          { message: 'Barcode Gen not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      const snoArray = chechkIsGen.SNo;
      const particularSno: any = snoArray.find(
        (sno) => sno.serialNumber === Sno,
      );

      if (!particularSno || particularSno.isProcessed === true) {
        throw new HttpException(
          { message: 'Barcode Already sticked cannot be Rejected' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (particularSno.isRejected === true) {
        throw new HttpException(
          { message: 'Barcode Already  Rejected' },
          HttpStatus.NOT_FOUND,
        );
      }
      particularSno.isRejected = true;
      const updatedGen = await chechkIsGen.save();
      const SKU = chechkIsGen.SKU;
      const product = await this.roboproductsModel
        .findOne({ SKU })
        .select('Name SKU Brand mainImage MRP Weight ');
      const info = {
        product,
        barcode: particularSno,
      };

      res.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Product fetched successfully',
        data: info,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Add category against one barcode
  async addSubCategory(req, res: Response) {
    try {
      const { barcode: barcodeData } = req.body; // Renamed to barcodeData for clarity

      for (const barcodeKey in barcodeData) {
        const sub = barcodeData[barcodeKey];

        const barcodeGen = await this.BarcodeGenModel.findOne({
          'SNo.serialNumber': barcodeKey,
        });

        if (!barcodeGen) {
          return res.status(400).json({
            status: 'error',
            message: `Invalid barcode: ${barcodeKey}`,
          });
        }

        // Find the index of the item in SNo array
        const indexToUpdate = barcodeGen.SNo.findIndex(
          (item) => item.serialNumber === barcodeKey,
        );

        if (indexToUpdate !== -1) {
          barcodeGen.SNo[indexToUpdate].sub = sub;
          await barcodeGen.save();
        } else {
          return res.status(400).json({
            status: 'error',
            message: `Barcode ${barcodeKey} not found in SNo array.`,
          });
        }
      }

      res.status(201).json({
        status: 'success',
        message: 'Added Barcode Subcategories Successfully',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }

  // Retrieves product information including barcode using SKU.
  async getProductWithBarcode(req, res: Response) {
    try {
      const { SKU } = req.body;

      if (!SKU) {
        throw new BadRequestException({
          status: 'error',
          message: 'SKU is required',
        });
      }

      // Find barcode using SKU
      const findBarcode = await this.BarcodeGenModel.findOne({ SKU });

      if (!findBarcode) {
        throw new BadRequestException({
          status: 'error',
          message: 'Barcode not found for the given SKU',
        });
      }

      // Find product name and mainImage using SKU
      const findName = await this.roboproductsModel
        .findOne({ SKU })
        .select('Name mainImage subItems');

      const data = {
        sku: findBarcode.SKU,
        name: findName.Name,
        image: findName.mainImage,
        barcode: findBarcode.SNo,
        subItems: findName.subItems,
      };

      res.status(200).send({
        status: 'success',
        data: data,
        message: 'Barcode Successfully Found',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Retrives all sales history
  async getSalesHistory(res) {
    try {
      const result = await this.SalesHistoryModel.find({}).sort({ Date: -1 });

      res.status(200).send({
        status: 'success',
        data: result,
        message: 'Sales History Succesfully fetched',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Retrives single sales history
  async getSingleSalesHistory(id, res) {
    try {
      if (!id) {
        throw new NotFoundException('id is required');
      }
      const result = await this.SalesHistoryModel.findById({ _id: id }).sort({
        updatedAt: -1,
      });
      const barcodes = result.Barcode;
      const productNames = await Promise.all(
        barcodes.map(async (barcode) => {
          const product = await this.roboproductsModel.findOne({
            SKU: barcode.slice(0, -3),
          });
          return product ? product.Name : '';
        }),
      );

      const barcodeWithName = barcodes.map((barcode, index) => ({
        barcode: barcode,
        name: productNames[index],
      }));
      res.status(200).send({
        status: 'success',
        data: {
          result: result,
          barcodeDetails: barcodeWithName,
        },
        message: 'Sales History Succesfully fetched',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // add customers and company information
  async addCustomer(res, body) {
    try {
      const { name, company, email, mobile } = body;
      const create = await this.CustomerModel.create({
        name: name,
        company: company,
        email: email,
        mobileNo: mobile,
      });
      res.status(201).send({
        status: 'success',
        message: 'Customer Details Added Successfully',
        data: create,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get all custormers

  async getAllCustomer(res) {
    try {
      const customers = await this.CustomerModel.find({})
      res.status(200).send({status:"success",message:"Customer Details fetched scuccessfully",data:customers})
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSingleCustomer(id,res) {
    try {
      const customers = await this.CustomerModel.findById({_id:id})
      res.status(200).send({status:"success",message:"Customer Details fetched scuccessfully",data:customers})
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
