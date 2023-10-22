import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FcmTokenService } from './notification.service';
import { AdminFcmtoken, AdminFcmTokenSchema } from './schema/adminFcmToken.schema';
import { Fcmtoken, FcmTokenSchema } from './schema/sellerFcmToken.schema';
import {  FirebaseService } from  "./firebase.service";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fcmtoken.name, schema: FcmTokenSchema },{name:AdminFcmtoken.name,schema:AdminFcmTokenSchema}]),
  ],
  providers: [FirebaseService,FcmTokenService],
  exports: [FirebaseService,FcmTokenService]
})
export class NotificationModule {}