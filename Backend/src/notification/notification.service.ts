import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Fcmtoken } from './schema/sellerFcmToken.schema';
import { AdminFcmtoken } from './schema/adminFcmToken.schema';

@Injectable()
export class FcmTokenService {
  constructor(
    @InjectModel(Fcmtoken.name) private FcmTokenModel: Model<Fcmtoken>,
    @InjectModel(AdminFcmtoken.name)
    private AdminFcmtokenModel: Model<AdminFcmtoken>,
  ) {}

  async updateFcmToken(sellerId: string, fcmToken: string): Promise<void> {
    const existingToken = await this.FcmTokenModel.findOne({ sellerId });

    if (existingToken) {
      existingToken.fcmToken = fcmToken;
      await existingToken.save();
    } else {
      await this.FcmTokenModel.create({ sellerId, fcmToken });
    }
  }

  async saveRegistrationToken(
    adminId: string,
    registrationToken: string,
  ): Promise<void> {
    let admin = await this.AdminFcmtokenModel.findOne({ adminId });
    try {
      if (admin && admin.fcmToken === "" || undefined) {
        admin.fcmToken = registrationToken;
        admin.save();
      } else {
        const createToken = await this.AdminFcmtokenModel.create({
          adminId: adminId,
          fcmToken: registrationToken,
        });
      }
    } catch (error) {
      console.log('Error Occured While Saviing Fcm Tokne :', error.message);
    }
  }
}
