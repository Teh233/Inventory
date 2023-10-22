import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RoboProductsModule } from './robo-products/robo-products.module';
import { CartModule } from './cart/cart.module';
import { SellerDocumentModule } from './seller-document/seller-document.module';
import { SellerOrderModule } from './seller-order/seller-order.module';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RestockModule } from './restock/restock.module';
import { VendorModule } from './vendor/vendor.module';
import { BarcodeModule } from './barcode/barcode.module';
import { PricesHistoryModule } from './prices-history/prices-history.module';
import { DiscountQueriesModule } from './discount-queries/discount-queries.module';
import { WebsocketEventsModule } from './websocket-events/websocket-events.module';
import { LogisticsModule } from './logistics/logistics.module';
import { ExpoModule } from './expo/expo.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const envType = configService.get('ENV');
        if (envType === 'Local') {
          // const uri = configService.get('DB_URL');
          // console.log('local');
          return {
            uri: 'mongodb://0.0.0.0:27017/DevRobot',
          };
        }
        const uri = configService.get('DB_Prod_URL');
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    RoboProductsModule,
    CartModule,
    SellerDocumentModule,
    SellerOrderModule,
    AdminModule,
    ServeStaticModule.forRoot({
      serveRoot: '/sellerDocuments',
      rootPath: join(__dirname, '..', 'uploads', 'sellerDocuments'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/sellerProfile',
      rootPath: join(__dirname, '..', 'uploads', 'sellerProfile'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/Sample',
      rootPath: join(__dirname, '..', 'uploads', 'Sample'),
      serveStaticOptions: {
        index: false,
      },
    }),
    RestockModule,
    VendorModule,
    BarcodeModule,
    PricesHistoryModule,
    DiscountQueriesModule,
    WebsocketEventsModule,
    LogisticsModule,
    ExpoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
