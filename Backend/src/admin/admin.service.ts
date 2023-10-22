import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import axios from 'axios';
import {
  genRandomToken,
  generateRandomNumber,
} from 'src/common/utils/common.utils';
import {
  LoginAdminDto,
  RegisterAdminDto,
  changePasswordDto,
  forgetPasswordDto,
} from './dto/create-admin.dto';
import { SellerAdmin, UserHistory } from './schema/admin.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { MailService } from '../mail/mail.service';
import { FcmTokenService } from '../notification/notification.service';
import { WebsocketEventsService } from 'src/websocket-events/websocket-events.service';

// SDK initialization

var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_o1s1y5LM7H/TAIj9bu/vJfHUyjc=',
  privateKey: 'private_Z7RuSoi4w5oqLCZZ9EGntsHjSz8=',
  urlEndpoint: 'https://ik.imagekit.io/f68owkbg7',
});
@Injectable()
export class AdminService {
  bcrypt: any;
  private readonly filePath = 'masterPassword.json';
  constructor(
    @InjectModel(SellerAdmin.name) private AdminModel: Model<SellerAdmin>,
    @InjectModel(UserHistory.name) private UserHistoryModel: Model<UserHistory>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private fcmtokenService: FcmTokenService,
    private readonly websocketEvent: WebsocketEventsService,
  ) {}

  // admin register
  async adminRegister(
    registerDto: RegisterAdminDto,
    res: Response,
    files: any,
  ): Promise<string | any> {
    try {
      const { name, email, password, department } = registerDto;
      const uploadedFile =
        files.Image && files.Image[0] ? files.Image[0] : null; // Check if the image file is present

      const alreadyRegistered = await this.AdminModel.findOne({ email: email });
      if (alreadyRegistered) {
        return res.status(400).json({
          message: 'Email is already registered plz login',
        });
      }

      if (uploadedFile) {
        const filePath = `/${Date.now()}/${uploadedFile.originalname}`;
        const folderPath = `${process.env.IMAGEKIT_FOLDER}/AdminProfile`;
        const uploadRes = await imagekit.upload({
          file: uploadedFile.buffer,
          fileName: filePath,
          folder: folderPath,
        });
        const adminProfile = {
          fileId: uploadRes.fileId,
          url: uploadRes.url,
        };
        let adminId = 'AID' + generateRandomNumber(4);
        const hashedPassword = await bcrypt.hash(password, 10);
        let adminData = {
          adminId,
          name,
          email,
          password: hashedPassword,
          profileImage: adminProfile,
          Department: department,
        };
        let isDuplicate = true;
        while (isDuplicate) {
          const existingAdmin = await this.AdminModel.findOne({ adminId });
          if (!existingAdmin) {
            isDuplicate = false;
          } else {
            adminId = 'AID' + generateRandomNumber(4);
          }
        }
        const admin = await this.AdminModel.create(adminData);
        res.status(201).send({
          status: 'success',
          message: 'Admin registered successfully',
          data: admin,
        });
      } else {
        let adminId = 'AID' + generateRandomNumber(4);
        const hashedPassword = await bcrypt.hash(password, 10);
        let adminData = {
          adminId,
          name,
          email,
          password: hashedPassword,
          Department: department,
        };
        let isDuplicate = true;
        while (isDuplicate) {
          const existingAdmin = await this.AdminModel.findOne({ adminId });
          if (!existingAdmin) {
            isDuplicate = false;
          } else {
            adminId = 'AID' + generateRandomNumber(4);
          }
        }
        const admin = await this.AdminModel.create(adminData);
        res.status(201).send({
          status: 'success',
          message: 'Admin registered successfully',
          data: admin,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // admin login
  async adminLogin(loginDto: LoginAdminDto, res) {
    try {
      const { email, password, fcmAdminToken, unique, Location } = loginDto;

      /// get location information
      const { longitude, latitude } = Location;

      /// isLocal server check
      const localServer = process.env.LOCAL_SERVER ? true : false;

      if (!longitude && !latitude && !localServer) {
        return res.status(404).send({
          status: 'error',
          message: 'Location is required',
        });
      }

      const reverseGeocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const response = await axios.get(reverseGeocodeUrl);
      const locationData = response.data;

      // Use locationData to retrieve location information
      const { city, locality, principalSubdivision, countryName } =
        locationData;

      const admin = await this.AdminModel.findOne({ email: email });
      if (!admin) {
        return res.status(404).send({
          status: 'error',
          message: 'Admin not found, please register first',
        });
      }

      if (!admin.isActive) {
        return res.status(404).send({
          status: 'error',
          message: 'You Account has been paused',
        });
      }
      let isOtp = false;

      const loggedInUsers = this.websocketEvent.currentOnlineUsers();

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        res.status(404).send({ status: 'error', message: 'Wrong password' });
        return;
      }

      const token = this.jwtService.sign({ id: admin._id });
      const eventData = {
        message: `${admin.name} logged in to the portal location ${
          city || 'unknown'
        } , ${locality || 'unknown'}`,
        time: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      this.websocketEvent.emitToAll('liveStatusClient', eventData);

      const newUserHistory = {
        userId: admin.adminId,
        message: eventData.message,
        type: 'login',
        by: 'user',
      };

      await this.UserHistoryModel.create(newUserHistory);

      if (!admin.isAdmin && admin.unique !== unique) {
        let otp = generateRandomNumber(4);
        let email = process.env.OTP_LOGIN_EMAIL;
        const subject = `${admin.name} attempted to log in (${
          admin.email
        }) location ${city || 'unknown'} , ${locality || 'unknown'}`;
        await this.mailService.sendOtpToCustomer(otp, email, subject);
        isOtp = true;
        admin.loginOtp = otp;
        await admin.save();
      }

      // Exclude sensitive data from the response
      const { password: _, ...adminData } = admin.toObject();

      // Call the saveRegistrationToken function
      const adminId = admin.adminId;

      const registrationToken = fcmAdminToken;

      await this.fcmtokenService.saveRegistrationToken(
        adminId,
        registrationToken,
      );

      return res
        .status(200)
        .cookie('IRSADMIN', token, {
          expires: new Date(new Date().getTime() + 5 * 60 * 60 * 1000),
          // httpOnly: true,
          // secure: true,
        })
        .send({
          status: 'success',
          message: 'Login successful',
          data: { ...adminData, isOtp: isOtp },
        });
    } catch (error) {
      console.error('An error occurred while processing login:', error);
      return res.status(500).send({
        status: 'error',
        message: 'An unexpected error occurred during login',
      });
    }
  }

  // opt verification
  async verifyLoginOtp(req, res) {
    try {
      const { adminId, otp } = req.body;

      const user = await this.AdminModel.findOne({ adminId: adminId });
      if (!user) {
        return res
          .status(404)
          .send({ status: 'error', message: 'user not found' });
      }
      if (user.loginOtp !== otp) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Invalid Otp' });
      }

      const uniqueId = generateRandomNumber(8);

      user.unique = JSON.stringify(uniqueId);

      await user.save();

      const { password: _, ...adminData } = user.toObject();

      res.send({
        status: 'success',
        message: 'User Login Successfully ',
        data: { ...adminData, uniqueId: uniqueId },
      });
    } catch (error) {
      res.status(200).send({
        statsu: 'error',
        message: 'Server Error',
        error: error.message,
      });
    }
  }

  // admin logout
  async adminLogout(res) {
    try {
      // console.log("ho")
      res
        .status(200)
        .cookie('IRSADMIN', null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .send({ status: 'success', message: 'Logout successful' });
      return;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to Logged out',
        error: error.message,
      };
    }
  }

  // userRoleUpdates
  async userRoleUpdate(req, res, Type) {
    try {
      if (Type === 'userRole') {
        const { role, adminId } = req.body;
        console.log(role);
        const user = await this.AdminModel.findOneAndUpdate(
          { adminId: adminId },
          { $set: { userRoles: role } },
          { new: true },
        );

        if (!user) {
          return res.status(404).send({
            status: 'error',
            message: 'User not found',
          });
        }

        res.status(200).send({
          status: 'success',
          message: 'User role updated successfully',
          data: user,
        });
      } else if (Type === 'admin') {
        const { adminId } = req.body;
        const user = await this.AdminModel.findOneAndUpdate(
          { adminId: adminId },
          { $set: { isAdmin: true } },
          { new: true },
        );

        if (!user) {
          return res.status(404).send({
            status: 'error',
            message: 'User not found',
          });
        }

        res.status(200).send({
          status: 'success',
          message: 'User admin updated successfully',
          data: user,
        });
      } else if (Type === 'isActive') {
        const { isActive, adminId } = req.body;
        const user = await this.AdminModel.findOneAndUpdate(
          { adminId: adminId },
          { $set: { isActive: isActive } },
          { new: true },
        );

        if (!isActive) {
          this.websocketEvent.emitToAll('userLogout', { userId: adminId });
        }

        if (!user) {
          return res.status(404).send({
            status: 'error',
            message: 'User not found',
          });
        }

        res.status(200).send({
          status: 'success',
          message: `User account ${isActive ? 'resumed' : 'paused'}`,
        });
      } else if (Type === 'product') {
        const { items, adminId } = req.body;
        const user = await this.AdminModel.findOneAndUpdate(
          { adminId: adminId },
          { $set: { productColumns: items } },
          { new: true },
        );

        if (!user) {
          return res.status(404).send({
            status: 'error',
            message: 'User not found',
          });
        }

        res.status(200).send({
          status: 'success',
          message: 'product column updated successfully',
          data: user,
        });
      } else if (Type === 'delete') {
        const { adminId } = req.body;
        const user = await this.AdminModel.findOneAndDelete({
          adminId: adminId,
        });

        res.status(200).send({
          status: 'success',
          message: `user ${user.name} deleted successfully`,
        });
      } else {
        res.status(400).send({
          status: 'error',
          message: 'Invalid Type value',
        });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // get all users
  async getAllUserAdmin(res) {
    try {
      const users = await this.AdminModel.find({});
      if (!users) {
        return res
          .status(404)
          .send({ status: 'error', message: 'No users found' });
      }

      res.status(200).send({
        status: 'success',
        message: 'Users fetched successfully',
        data: users,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // get single userAdmin
  async getSingleUser(res, adminId) {
    try {
      if (!adminId) {
        return res
          .status(404)
          .send({ status: 'error', message: 'adminId is required' });
      }
      const userAdmin = await this.AdminModel.findOne({ adminId: adminId });
      if (!userAdmin) {
        return res
          .status(404)
          .send({ status: 'error', message: 'User not found' });
      }
      res.status(200).send({
        status: 'success',
        message: 'user successfully found',
        data: userAdmin,
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // delete Single user
  async deleteSingleUser(res, adminId) {
    try {
      if (!adminId) {
        return res
          .status(404)
          .send({ status: 'error', message: 'adminId is required' });
      }
      const user = await this.AdminModel.findOneAndDelete({ adminId: adminId });
      if (!user) {
        return res
          .status(404)
          .send({ status: 'error', message: 'User not found' });
      }
      res
        .status(200)
        .send({ status: 'success', message: 'user deleted successfully' });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // admin change password
  async changePassword(
    changePasswordDto: changePasswordDto,
    adminId: string | any,
    res: Response,
  ) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;
      const seller = await this.AdminModel.findOne({ adminId: adminId });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'seller not found',
        });
        return;
      }
      const comparePassword = await bcrypt.compare(
        oldPassword,
        seller.password,
      );
      console.log(comparePassword);
      if (!comparePassword) {
        res.status(404).send({
          status: 'error',
          message: 'Password has incorrect',
        });
        return;
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      seller.password = hashedPassword;
      await seller.save();
      res.status(200).send({
        status: 'success',
        message: 'Password changed successfully',
      });
      return;
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // admin forget password
  async forgetPassword(res, forgetPassword: forgetPasswordDto) {
    try {
      const { email } = forgetPassword;
      const admin = await this.AdminModel.findOne({ email: email });
      if (!admin) {
        res.status(404).send({ status: 'error', message: 'User not found' });
        return;
      }
      const resetToken = genRandomToken();
      const cryToken = (admin.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'));
      admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      await admin.save();
      const frontendUrl = process.env.FRONTEND_URL;
      const resetUrl = `${frontendUrl}/admin/resetPassword/${cryToken}`;
      const message = `
      <p>Click on the given link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you have not requested this password reset, please ignore this email.</p>
    `;
      const subject = 'IndianRobotic Solution';
      await this.mailService.sendResetToken(admin.email, subject, message);
      res.status(201).send({
        status: 'success',
        msg: 'Reset token has been sent to your email successfully',
      });
      return;
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // resetToken for admin
  async resetPassword(resetPassword, token, res) {
    try {
      const { newPassword } = resetPassword;
      if (newPassword === undefined || null) {
        res.status(404).send({
          status: 'error',
          message: 'Password is required',
        });
        return;
      }
      const admin = await this.AdminModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!admin) {
        res.status(404).send({
          status: 'error',
          message: 'Token is invalid or has expired',
        });
        return;
      }
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      admin.password = newPasswordHash;
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save();
      res.status(201).send({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  /// setMasterPassword
  async createOrUpdateMasterPassword(req: Request, res: Response) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(404).send({
          status: 'error',
          message: 'Password is required',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const masterPasswordData = {
        MasterPassword: hashedPassword,
      };

      fs.writeFileSync(this.filePath, JSON.stringify(masterPasswordData));
      res.status(200).send({
        status: 'success',
        message: 'Master password updated successfully',
      });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  }

  // get all usersHistory
  async getAllLatestUserHistory(res, page = 1) {
    try {
      const usersHistoryData = await this.UserHistoryModel.find({})
        .sort({ createdAt: -1 })
        .limit(60); // Limit the query to the latest 60 records

      if (!usersHistoryData || usersHistoryData.length === 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No user history data found',
        });
      }

      res.status(200).send({
        status: 'success',
        message: 'Latest user history data fetched successfully',
        data: usersHistoryData,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred while fetching user history data',
      });
    }
  }
}
