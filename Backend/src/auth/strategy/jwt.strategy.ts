import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import { Seller } from '../schema/users.schema';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.IRS,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    try {
      const user = await this.sellerModel.findById(id);
      if (!user) {
        throw new NotFoundException('Login first to access this');
      }
      return user;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
