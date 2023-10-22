import { Module } from '@nestjs/common';
import { SellerDocumentService } from './seller-document.service';
import { SellerDocumentController } from './seller-document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SellerDocument,
  SellerDocumentSchema,
} from './schema/seller-document.schema';
import { Seller, SellerSchema } from 'src/auth/schema/users.schema';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketEventsModule } from 'src/websocket-events/websocket-events.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerDocument.name, schema: SellerDocumentSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
    AdminModule,
    AuthModule,
    WebsocketEventsModule
  ],
  controllers: [SellerDocumentController],
  providers: [SellerDocumentService],
})
export class SellerDocumentModule {}
