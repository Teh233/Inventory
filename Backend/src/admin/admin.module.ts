import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerAdmin, AdminSchema,UserHistory,UserHistorySchema } from './schema/admin.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { WebsocketEventsModule } from 'src/websocket-events/websocket-events.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => {
        return {
          secret: configservice.get<string>('ADMIN_SECRET'),
          signOptions: {
            expiresIn: configservice.get<string | number>('ADMIN_EXPIRE'),
          },
          name: 'admin-jwt',
        };
      },
    }),
    MongooseModule.forFeature([
      { name: SellerAdmin.name, schema: AdminSchema },
      { name: UserHistory.name, schema: UserHistorySchema },
    ]),
    AuthModule,NotificationModule,
    WebsocketEventsModule
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy, AdminAuthGuard,MailService],
})
export class AdminModule {}
