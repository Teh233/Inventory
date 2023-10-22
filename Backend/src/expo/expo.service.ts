import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateExpoDto } from './dto/create-expo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expo } from './schema/expo.schema';
import { MailService } from 'src/mail/mail.service';
import { Company, Invitee } from './schema/invitee.schema';
var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_JrmYS9LlAdCUKrwBc9FtN2QBKiA=',
  privateKey: 'private_5rRWktPKtZZZ/2xTtMAO6Dy3dAU=',
  urlEndpoint: 'https://ik.imagekit.io/exbyhpjtw',
});

@Injectable()
export class ExpoService {
  constructor(
    @InjectModel(Expo.name) private ExpoModel: Model<Expo>,
    @InjectModel(Invitee.name) private InvitteModel: Model<Invitee>,
    @InjectModel(Company.name) private CompanyModel: Model<Company>,
    private readonly mailService: MailService,
  ) {}

  async create(createExpoDto: CreateExpoDto, res) {
    try {
      const { name, mobileNo, email, companyName } = createExpoDto;
      const info = {
        name: name,
        mobileNo: mobileNo,
        email: email,
        companyName: companyName,
      };
      const createExpo = await this.ExpoModel.create(info);
      const subject = 'Indian Robotics Solution';
      await this.mailService.sendGreetings(email, subject, name);
      res.status(201).send({ message: 'successful' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async add(body: any, res) {
    try {
      const { name, mobileNo, email, companyName, designation,VisitorsType } = body;    
      const info = {
        name: name,
        mobileNo: mobileNo,
        email: email,
        companyName: companyName,
        designation: designation,
        VisitorsType: VisitorsType,
      };
      const createExpo = await this.InvitteModel.create(info);
      const subject = 'Indian Robotics Solution';
      const message = "🎉 Thank You For Joining Us! 🙌";
      await this.mailService.sendResetToken(email, subject, message);
      res.status(201).send({ message: 'successful', data: createExpo });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addFile(res,file){
    try{
      let uploadFiles:any = {}
      if (file) {
        const folder = 'ExpoInvite';
        const folderPath = `${process.env.IMAGEKIT_FOLDER}/Expo/${folder}`;
        uploadFiles = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: folderPath,
        });
      }
      const filedata = await this.InvitteModel.create({image:{fileId:uploadFiles.fileId,url:uploadFiles.url}})
      res.status(200).send({message:"succesfull",data:filedata})
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }
  }

  async getAllCompany(res) {
    try {
      const company = await this.CompanyModel.find();
      res
        .status(200)
        .send({ message: 'All Company Fetched successfully', data: company });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
