import { Module } from '@nestjs/common';
import { RoboProductsController } from './robo-products.controller';
import {
  roboproducts,
  roboProductSchema,
  roboProductHistorySchema,
  roboproducthistory,
} from './schema/robo-products.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoboProductsService } from './robo-products.service';
import { AdminModule } from 'src/admin/admin.module';
import { BarcodeModule } from 'src/barcode/barcode.module';
import { WebsocketEventsModule } from 'src/websocket-events/websocket-events.module';
import { Brand, BrandSchema } from './schema/brand.schema';
import { Calc, CalcSchema } from './schema/calc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: roboproducts.name, schema: roboProductSchema },
      { name: roboproducthistory.name, schema: roboProductHistorySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Calc.name, schema: CalcSchema },
    ]),
    AuthModule,
    AdminModule,
    BarcodeModule,
    WebsocketEventsModule,
  ],
  controllers: [RoboProductsController],
  providers: [RoboProductsService],
  exports: [RoboProductsService],
})
export class RoboProductsModule {}
