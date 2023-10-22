import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminFcmtoken } from './schema/adminFcmToken.schema';
import * as admin from 'firebase-admin';

const serviceAccount = require('../../config/firebase-admin.json');

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor(
    @InjectModel(AdminFcmtoken.name) private AdminToken: Model<AdminFcmtoken>,
  ) {
    const appName = `myAppName_${Math.floor(Math.random() * 1000)}`; // Generate a unique app name

    // Log the serviceAccount object
    console.log('Service Account:', serviceAccount);

    this.firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
      },
      appName,
    );
  }

  async sendNotification(
    title: string,
    body: string,
    token: string,
  ): Promise<any> {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await this.firebaseApp.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  }

  async sendNotificationToAdmin(
    adminId: string,
    title: string,
    body: string,
    url: string,
  ): Promise<void> {
    const admin:any = await this.AdminToken.findOne({ adminId });
    console.log(admin);
    if (!admin && admin.fcmToken == "" || admin.isAdmin === false) {
      // No admin found or no FCM token available, handle it accordingly
      return;
    }

    const registrationToken = admin.fcmToken;

    const message: admin.messaging.Message = {
      webpush: {
        notification: {
          title,
          body,
        },
        fcmOptions: {
          link: url, // Include the URL as the link in the FCM options
        },
      },
      token: registrationToken,
    };
    // console.log('hitt', this.firebaseApp);
    try {
      await this.firebaseApp.messaging().send(message);
      console.log('Successfully sent notification to admin.');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
