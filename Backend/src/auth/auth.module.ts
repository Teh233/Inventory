import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Seller, SellerSchema } from './schema/users.schema';
import {
  SellerDocument,
  SellerDocumentSchema,
} from '../seller-document/schema/seller-document.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminSchema, SellerAdmin } from 'src/admin/schema/admin.schema';
import { WebsocketEventsModule } from 'src/websocket-events/websocket-events.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Seller.name, schema: SellerSchema },
      { name: SellerDocument.name, schema: SellerDocumentSchema },
      { name: SellerAdmin.name, schema: AdminSchema },
    ]),
    MailModule,
    WebsocketEventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
