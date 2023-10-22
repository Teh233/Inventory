import { Module } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { BarcodeController } from './barcode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BarcodeGen,
  BarcodeHistory,
  BarcodeReturn,
  SalesHistory,
  barcodeGenSchema,
  barcodeHistorySchema,
  barcodeReturnSchema,
  salesHistorySchema,
} from './schema/barcode.schema';
import {
  roboProductSchema,
  roboproducts,
} from 'src/robo-products/schema/robo-products.schema';
import { Customer, CustomerSchema } from './schema/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BarcodeGen.name, schema: barcodeGenSchema },
      { name: BarcodeHistory.name, schema: barcodeHistorySchema },
      { name: BarcodeReturn.name, schema: barcodeReturnSchema },
      { name: roboproducts.name, schema: roboProductSchema },
      { name: SalesHistory.name, schema: salesHistorySchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [BarcodeController],
  providers: [BarcodeService],
  exports: [BarcodeService],
})
export class BarcodeModule {}
