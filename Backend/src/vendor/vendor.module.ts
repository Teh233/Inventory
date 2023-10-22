import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientUser,
  Vendor,
  clientUserSchema,
  vendorSchema,
} from './schema/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vendor.name, schema: vendorSchema },
      { name: ClientUser.name, schema: clientUserSchema },
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
