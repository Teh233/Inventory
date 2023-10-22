import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  changePasswordDto,
  CreateUserDto,
  forgetPasswordDto,
  LoginUserDto,
  otpVerification,
  personalQueryDto,
  resetPasswordDto,
} from './dto/create-user.dto';
import { Seller } from './schema/users.schema';
import { SellerDocument } from '../seller-document/schema/seller-document.schema';
import { WebsocketEventsService } from 'src/websocket-events/websocket-events.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as fs from 'fs';
import {
  generateRandomNumber,
  genRandomToken,
} from 'src/common/utils/common.utils';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly filePath = 'masterPassword.json';
  constructor(
    @InjectModel(Seller.name) private UserModel: Model<Seller>,
    @InjectModel(SellerDocument.name)
    private sellerDocument: Model<SellerDocument>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly websocketEvent: WebsocketEventsService,
  ) {}

  // register
  async register(
    registerDto: CreateUserDto,
    res: Response,
  ): Promise<string | any> {
    try {
      const { name, email, password, companyName, mobileNo } = registerDto;
      let user = await this.UserModel.findOne({ email: email });
      if (user && user.isOtpVerified) {
        res.status(404).send({
          status: 'error',
          message: 'Seller already found! plz login',
        });
        return;
      }
      let clearPrevData = await this.UserModel.findOneAndDelete({
        email: email,
      });
      let sellerId = 'SID' + generateRandomNumber(4);
      const hashedPassword = await bcrypt.hash(password, 10);
      let data = {
        sellerId,
        name,
        companyName,
        mobileNo,
        email,
        password: hashedPassword,
      };
      let isDuplicate = true;
      while (isDuplicate) {
        const existingSeller = await this.UserModel.findOne({ sellerId });
        if (!existingSeller) {
          isDuplicate = false;
        } else {
          // Generate a new sellerId
          sellerId = 'SID' + generateRandomNumber(4);
        }
      }
      user = await this.UserModel.create(data);
      if (user) {
        const liveStatusData = {
          message: `New WholeSale Customer Registered By The Company ${companyName}`,
          time: new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        };
        this.websocketEvent.emitToAll('WholeSaleSeller', liveStatusData);
        const genOtp = generateRandomNumber(4);
        const subject: string = 'Welcome to IndianRobtics Solution';
        user.otp = genOtp;
        await user.save();
        await this.mailService.sendOtpToCustomer(genOtp, email, subject);

        res.status(201).send({
          status: 'success',
          message: 'seller registered otp send successfully',
        });
        return;
      } else {
        res.status(404).send({
          status: 'error',
          message: 'failed to register seller',
        });
        return;
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // login
  async login(loginDto: LoginUserDto, res: Response): Promise<string | any> {
    const { email, password } = loginDto;
    try {
      const user: any = await this.UserModel.findOne({ email: email });
      // const masterPasswordData = fs.readFileSync(this.filePath, 'utf8');
      // const { MasterPassword } = JSON.parse(masterPasswordData);
      if (!user || !user.isOtpVerified) {
        res.status(401).send({
          status: 'error',
          message: 'You Dont have an Account, Sign up First to login',
        });
        return;
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        res.status(401).send({
          status: 'error',
          message: 'Invalid password',
        });
        return;
      }
      await user.save();
      // Remove sensitive fields from the user object
      user.password = undefined;
      user.otp = undefined;
      const token = this.jwtService.sign(
        { id: user._id, sellerId: user.sellerId },
        { expiresIn: '5h' },
      );
      const eventData = {
        message: `WholeSale Customer ${user.name} logged in to the portal`,
        time: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      this.websocketEvent.emitToAll('WholeSaleSeller', eventData);
      res
        .status(200)
        .cookie('IRS', token, {
          expires: new Date(new Date().getTime() + 5 * 60 * 60 * 1000),
          // httpOnly: true,
          // secure: false,
        })
        .send({ status: 'success', message: 'login Successful', data: user });
      return;
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // logout
  async logout(res: Response) {
    try {
      res
        .status(200)
        .cookie('IRS', null, {
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

  // otp verification
  async otpVerification(otpVerification: otpVerification, res: Response) {
    try {
      const { email, otp } = otpVerification;
      const seller = await this.UserModel.findOne({ email: email });
      // console.log(seller);
      if (seller === null) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      // Compare current time with createdAt timestamp
      const currentTime = new Date();
      const createdAt = seller.createdAt;
      const timeDifference = currentTime.getTime() - createdAt.getTime();
      // Check if OTP has expired (5 minutes = 5 * 60 * 1000 milliseconds)
      const otpExpirationTime = 5 * 60 * 1000;
      if (timeDifference > otpExpirationTime) {
        res.status(404).send({
          status: 'error',
          message: 'otp has expired',
        });
        return;
      }
      if (seller.otp === +otp) {
        res.status(200).send({
          status: 'success',
          message:
            'Your OTP has been verified successfully. Please proceed with login.',
        });
        seller.otp = null;
        seller.isOtpVerified = true;
        await seller.save();
        return;
      } else {
        res.status(404).send({
          status: 'error',
          message: 'Incorrect OTP',
        });
        return;
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // otp generate
  async otpReGenerate(body: any, res: Response) {
    try {
      const { email } = body;
      const reGenOtp = generateRandomNumber(4);
      if (!reGenOtp) {
        return {
          status: 'error',
          message: 'Error found wile generating otp',
        };
      }
      const seller = await this.UserModel.findOne({ email: email });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      seller.otp = reGenOtp;
      await seller.save();
      const subject = 'Thanks For Choosing us';
      await this.mailService.sendOtpToCustomer(reGenOtp, seller.email, subject);
      res.status(200).send({
        status: 'success',
        message: 'Otp successfully send to your email',
      });
      return;
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // change password
  async changePassword(
    changePasswordDto: changePasswordDto,
    sellerId: string | any,
    res: Response,
  ) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;
      const seller = await this.UserModel.findOne({ sellerId: sellerId });
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
      if (!comparePassword) {
        res.status(401).send({
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

  // forget Password
  async forgetPassword(forgetPasswordDto: forgetPasswordDto, res: Response) {
    try {
      const { email } = forgetPasswordDto;
      const seller = await this.UserModel.findOne({ email: email });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Token is invalid or has expired',
        });
        return;
      }
      const resetToken = genRandomToken(); // Generate unhashed random token
      const crypToken = (seller.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')); // Hash the token
      seller.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      await seller.save();
      const frontendUrl = process.env.FRONTEND_URL;
      const resetUrl = `${frontendUrl}/auth/resetPassword/${crypToken}`;
      const message = `
        <p>Click on the given link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you have not requested this password reset, please ignore this email.</p>
      `;
      const subject = 'IndianRobotic Solution';
      await this.mailService.sendResetToken(seller.email, subject, message);
      res.status(201).send({
        status: 'success',
        msg: 'Reset token has been sent to your email successfully',
      });
      return;
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // reset Password
  async resetPassword(
    resetPasswordDto: resetPasswordDto,
    token: string,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const { newPassword } = resetPasswordDto;
      if (newPassword === undefined || null) {
        res.status(404).send({
          status: 'error',
          message: 'Password is required',
        });
        return;
      }
      const seller = await this.UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Token is invalid or has expired',
        });
        return;
      }
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      seller.password = newPasswordHash;
      seller.resetPasswordToken = undefined;
      seller.resetPasswordExpire = undefined;
      await seller.save();
      res.status(201).send({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      // console.log(error.message);
      res.status(500).send({
        status: 'error',
        msg: error.message,
      });
    }
  }

  // authenticated route
  async authenticatedRoute(seller): Promise<any> {
    try {
      if (!seller) {
        const data = {
          status: 'error',
          msg: 'UnAutthorized Seller',
        };
        return data;
      }
      const data = { status: 'success', seller: seller };
      return data;
    } catch (error) {
      return error.message;
    }
  }

  // upload profile for seller
  async uploadProfile(res: Response, sellerId: any, file: any) {
    try {
      if (!sellerId || !file) {
        res
          .status(404)
          .send({ status: 'error', message: 'Profile and sellerId required' });
        return;
      }
      const seller = await this.UserModel.findOne({ sellerId: sellerId });
      if (!seller) {
        res.status(404).send({ status: 'error', message: 'Seller not found' });
        return;
      }
      const pic = file.filename;
      seller.profile = pic;

      await seller.save();
      res.status(201).send({
        status: 'success',
        message: 'Your Profile Uploaded Successfully',
      });
    } catch (error) {
      res.status(501).send({ status: 'error', message: error.message });
    }
  }

  // admin section
  // get all seller using verified or not submit and submit in query or also without query u can get all seller
  async getAllSeller(res: Response, query: string) {
    try {
      let filter: any = {};
      let message: String;
      if (query === 'verified') {
        filter = { personalQuery: 'verify' };
        message = 'Verified sellers found';
      } else if (query === 'notsubmit') {
        filter = { personalQuery: 'not_submit' };
        message = 'Not submitted sellers found';
      } else if (query === 'submit') {
        filter = { personalQuery: 'submit' };
        message = 'Submitted sellers found';
      } else if (query === 'both') {
        filter = { personalQuery: { $in: ['not_submit', 'submit', 'reject'] } };
        message = 'Not Submit and Submit sellers found';
      } else {
        message = 'All sellers found';
      }

      const sellers = await this.UserModel.find(filter, '-password -otp');

      if (!sellers || sellers.length === 0) {
        res.status(200).send({ status: 'null', message: 'Sellers not found' });
        return;
      }
      // console.log(sellers);
      const sellersWithDocument = await Promise.all(
        sellers.map(async (seller) => {
          const document = await this.sellerDocument.findOne({
            sellerId: seller.sellerId,
          });
          return { ...seller.toObject(), document: document };
        }),
      );

      res.status(200).send({
        status: 'success',
        message: message,
        sellers: sellersWithDocument,
      });
    } catch (error) {
      res.status(501).send({ status: 'error', message: error.message });
    }
  }

  // verifying personal query for admin
  async verifySeller(
    sellerId: String,
    res: Response,
    queryStatus: personalQueryDto,
  ) {
    try {
      const { personalQuery } = queryStatus;
      if (!sellerId) {
        res
          .status(404)
          .send({ status: 'error', message: 'SellerId not found' });
        return;
      }
      const seller = await this.UserModel.findOne({ sellerId: sellerId });
      if (!seller) {
        res.status(404).send({ status: 'error', message: 'Seller not found' });
        return;
      }
      if (personalQuery) seller.personalQuery = personalQuery;
      await seller.save();
      res.status(201).send({
        status: 'success',
        message: `Seller Documents ${personalQuery}`,
      });
    } catch (error) {
      res.status(501).send({ status: 'error', message: error.message });
    }
  }
}
