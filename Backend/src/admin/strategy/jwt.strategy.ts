import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import { SellerAdmin } from '../schema/admin.schema';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(SellerAdmin.name)
    private readonly AdminModel: Model<SellerAdmin>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.IRSADMIN;
      },
      secretOrKey: configService.get<string>('ADMIN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    try {
      const admin = await this.AdminModel.findById(id);
      // console.log('Admin:', admin);
      if (!admin) {
        throw new NotFoundException(
          'Admin not authenticated. Please log in again.',
        );
      }

      return admin;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

