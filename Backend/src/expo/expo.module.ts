import { Module } from '@nestjs/common';
import { ExpoService } from './expo.service';
import { ExpoController } from './expo.controller';
import { Expo, ExpoSchema } from './schema/expo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import {
  Company,
  CompanySchema,
  Invitee,
  InviteeSchema,
} from './schema/invitee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expo.name, schema: ExpoSchema },
      { name: Invitee.name, schema: InviteeSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    MailModule,
  ],
  controllers: [ExpoController],
  providers: [ExpoService, MailService],
})
export class ExpoModule {}
