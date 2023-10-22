import { Module } from '@nestjs/common';
import { RestockService } from './restock.service';
import { RestockController } from './restock.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PriceComparision,
  PriceComparisionSchema,
  Restock,
  restockSchema,
} from './schema/restock.schema';
import { OverseasOrder, overseasOrderSchema } from './schema/restock.schema';
import {
  Vendor,
  vendorSchema,
  ClientUser,
  clientUserSchema,
} from 'src/vendor/schema/vendor.schema';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restock.name, schema: restockSchema },
      { name: OverseasOrder.name, schema: overseasOrderSchema },
      { name: Vendor.name, schema: vendorSchema },
      { name: ClientUser.name, schema: clientUserSchema },
      { name: PriceComparision.name, schema: PriceComparisionSchema },
    ]),
    AuthModule,
    AdminModule,
  ],
  controllers: [RestockController],
  providers: [RestockService],
})
export class RestockModule {}