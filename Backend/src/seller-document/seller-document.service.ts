import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller } from 'src/auth/schema/users.schema';
import { WebsocketEventsService } from 'src/websocket-events/websocket-events.service';
// SDK initialization

var ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_o1s1y5LM7H/TAIj9bu/vJfHUyjc=',
  privateKey: 'private_Z7RuSoi4w5oqLCZZ9EGntsHjSz8=',
  urlEndpoint: 'https://ik.imagekit.io/f68owkbg7',
});

import {
  SellerAddessDto,
  SellerDocumentDto,
  UpdateSellerAddressDto,
  updateSellerdetailsDto,
} from './dto/create-seller-document.dto';
import { SellerDocument } from './schema/seller-document.schema';
import { Response, Request } from 'express';
import { compareSync } from 'bcryptjs';
@Injectable()
export class SellerDocumentService {
  constructor(
    @InjectModel(Seller.name)
    private SellerModel: Model<Seller>,
    @InjectModel(SellerDocument.name)
    private SellerDocumentModel: Model<SellerDocument>,
    private readonly websocketEvent: WebsocketEventsService,
  ) {}

  // add seller document
  async createSellerDocument(
    sellerDocumentDto: SellerDocumentDto,
    res,
    files: {
      chequeFile?: Express.Multer.File[];
      logoFile?: Express.Multer.File[];
      gstFile?: Express.Multer.File[];
      msmeFile?: Express.Multer.File[];
    },
    req,
  ) {
    try {
      const users: any = req.user;
      const sellerId = users.sellerId;
      const {
        concernPerson,
        mobileNo,
        email,
        gst,
        msme,
        city,
        pincode,
        state,
        country,
        addressLine1,
        addressLine2,
        companyName,
        companyType,
        alternateCompanyName,
        bankName,
        bankBranch,
        ifscCode,
        accountNumber,
        accountType,
        alternateMobileNo,
        nameOfBeneficiary,
        alternateEmailId,
      } = sellerDocumentDto;

      if (
        !sellerId ||
        !concernPerson ||
        !mobileNo ||
        !gst ||
        !pincode ||
        !city
      ) {
        res.status(404).send({
          status: 'error',
          message: 'Required fields are missing',
        });
        return;
      }

      const seller = await this.SellerModel.findOne({ sellerId: sellerId });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found with this sellerId',
        });
        return;
      }
      // for existing seller in sellerDocumennt
      const existingSellerDetails = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      if (existingSellerDetails && seller.personalQuery !== 'reject') {
        res.status(400).send({
          status: 'error',
          message: 'SellerDocument already found plz proceed further ',
        });
        return;
      }
      const deleteExistingOne = await this.SellerDocumentModel.findOneAndDelete(
        {
          sellerId: sellerId,
        },
      );

      // for saving file in database and imagekit
      const uploadedFiles = await this.uploadFilesToImageKit(files, sellerId);

      console.log(uploadedFiles);

      const sellerData = {
        sellerId,
        concernPerson,
        mobileNo,
        email,
        gst,
        msme,
        companyName,
        companyType,
        alternateCompanyName,
        bankBranch,
        bankName,
        accountNumber,
        accountType,
        ifscCode,
        alternateEmailId,
        alternateMobileNo,
        nameOfBeneficiary,
        address: [
          {
            name: concernPerson,
            mobileNo,
            city,
            state,
            pincode,
            country,
            addressLine1,
            addressLine2,
          },
        ],
        files: {
          gstFile: {
            fileId: uploadedFiles.gstFile ? uploadedFiles.gstFile.fileId : null,
            url: uploadedFiles.gstFile ? uploadedFiles.gstFile.url : null,
          },
          msmeFile: {
            fileId: uploadedFiles.msmeFile
              ? uploadedFiles.msmeFile.fileId
              : null,
            url: uploadedFiles.msmeFile ? uploadedFiles.msmeFile.url : null,
          },
        },
        companyLogo: {
          fileId: uploadedFiles.logoFile ? uploadedFiles.logoFile.fileId : null,
          url: uploadedFiles.logoFile ? uploadedFiles.logoFile.url : null,
        },
        cancelCheque: {
          fileId: uploadedFiles.chequeFile
            ? uploadedFiles.chequeFile.fileId
            : null,
          url: uploadedFiles.chequeFile ? uploadedFiles.chequeFile.url : null,
        },
      };

      const sellerDocs = await this.SellerDocumentModel.create(sellerData);
      seller.personalQuery = 'submit';
      await seller.save();
      if (sellerDocs) {
        // console.log(sellerDocs);
        seller.personalQuery = 'submit';
        await seller.save();
        const id = sellerDocs.toObject().address[0]._id;
        // console.log(id);
        sellerDocs.defaultBilling = id;
        sellerDocs.defaultShipping = id;
        await sellerDocs.save();
      }

      // websocket event
      const liveStatusData = {
        message: `WholeSale Customer By The Company ${companyName} Uploaded Documents for verification `,
        time: new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      this.websocketEvent.emitToAll('WholeSaleSeller', liveStatusData);
      // Remove sensitive fields from the user object
      seller.password = undefined;
      seller.otp = undefined;
      res.status(201).send({
        status: 'success',
        message: 'Seller Document created successfully',
        data: seller,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // add address for seller
  async addAddressForSeller(sellerAddressDto: SellerAddessDto, res: Response) {
    try {
      const {
        sellerId,
        name,
        mobileNo,
        city,
        state,
        country,
        addressLine1,
        addressLine2,
        pincode,
      } = sellerAddressDto;
      // console.log(sellerId, name, pincode);
      if (!sellerId || !name || !pincode) {
        res.status(401).send({
          error: 'status',
          message: 'Please enter the required fields to proceed',
        });
        return;
      }
      const findAddress = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      if (!findAddress) {
        res.status(401).send({
          status: 'error',
          message: 'Please Enter personal details first',
        });
        return;
      }
      const newAddress = {
        name: name,
        mobileNo: mobileNo,
        city: city,
        state: state,
        country: country,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        pincode: pincode,
      };

      findAddress.address.push(newAddress);
      await findAddress.save();

      res.status(200).send({
        status: 'success',
        message: 'Address added successfully',
        address: newAddress,
      });
    } catch (error) {
      res.status(501).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // update address for seller
  async updateAddress(
    updateAddressDto: UpdateSellerAddressDto,
    sellerId,
    addressId,
    res: Response,
  ) {
    try {
      const {
        name,
        mobileNo,
        city,
        country,
        addressLine1,
        addressLine2,
        state,
        pincode,
      } = updateAddressDto;
      const seller = await this.SellerDocumentModel.findOne({ sellerId });

      if (!seller) {
        res.status(401).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      const address = seller.address.find(
        (addr) => addr._id.toString() === addressId,
      );
      if (!address) {
        res.status(401).send({
          status: 'error',
          message: 'address not found',
        });
        return;
      }
      const updatedAddress = {
        name,
        mobileNo,
        city,
        state,
        pincode,
        addressLine1,
        addressLine2,
        country,
      };
      // Object.assign(address, updatedAddress);
      // await seller.save();
      const updateFields = {};
      for (const [key, value] of Object.entries(updatedAddress)) {
        if (value !== undefined) {
          updateFields[`address.$.${key}`] = value;
        }
      }

      await this.SellerDocumentModel.updateOne(
        { _id: seller._id, 'address._id': address._id },
        { $set: updateFields },
      );

      res.status(201).send({
        status: 'success',
        message: 'addrss updated successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // delete address for seller
  async deleteAddress(sellerId: string, addressId: string, res: Response) {
    try {
      const seller = await this.SellerDocumentModel.findOne({ sellerId });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }

      const addressIndex = seller.address.findIndex(
        (a) => a._id.toString() === addressId,
      );
      if (addressIndex === -1) {
        res.status(404).send({
          status: 'error',
          message: 'Address not found',
        });
        return;
      }

      // Remove the address from the array
      seller.address = seller.address.filter(
        (a) => a._id.toString() !== addressId,
      );

      // Save the updated seller document
      await seller.save();

      res.status(200).send({
        status: 'success',
        message: 'Address deleted successfully',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // upate all details of seller documents
  async updateSellerAllDetails(sellerId, res, updateData) {
    try {
      const update = await this.SellerDocumentModel.findOneAndUpdate(
        { sellerId: sellerId },
        updateData,
        { new: true },
      );
      // console.log(update)
      res.status(201).send({
        status: 'success',
        message: 'Seller updated successfully',
        data: update,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update files of seller documents
  async updateFiles(sellerId, query, res, file) {
    try {
      const uplodedFiles = file;

      if (!uplodedFiles) {
        return res
          .status(404)
          .send({ status: 'error', message: 'Please upload files' });
      }
      const existing: any = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      if (!existing) {
        return res
          .status(401)
          .send({ status: 'error', message: 'Document not found' });
      }
      if (existing.files[query]?.fileId) {
        await imagekit.deleteFile(existing.files[query].fileId);
      }
      if (existing[query]?.fileId) {
        await imagekit.deleteFile(existing.files[query].fileId);
      }
      const folder =
        query === 'gstFile'
          ? 'GST_FILES'
          : query === 'msmeFile'
          ? 'MSME_FILE'
          : query === 'chequeFile'
          ? 'CANCEL_CHEQUE'
          : query === 'logoFile'
          ? 'LOGO'
          : '';

      const folderPath = `${process.env.IMAGEKIT_FOLDER}/WholeSeller/${folder}/${sellerId}`;

      const imagekitUploads = await imagekit.upload({
        file: uplodedFiles.buffer,
        fileName: uplodedFiles.originalname,
        folder: folderPath,
      });
      if (query === 'gstFile' || 'msmeFile') {
        existing.files[query] = {
          fileId: imagekitUploads.fileId,
          url: imagekitUploads.url,
        };
      } else {
        {
          existing[query] = {
            fileId: imagekitUploads.fileId,
            url: imagekitUploads.url,
          };
        }
      }
      await existing.save();
      res
        .status(201)
        .send({ status: 'success', message: 'file updated successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // get address by id
  async getAddress(res: Response, sellerId: String) {
    // console.log(sellerId);
    try {
      const seller = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      const address = seller.address;
      if (!address) {
        return res.status(404).send({
          status: 'error',
          message: 'No Address found',
        });
      }
      return res.status(200).send({
        status: 'success',
        message: 'Your saved Address',
        defaultBilling: seller.defaultBilling,
        defaultShipping: seller.defaultShipping,
        Address: address,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // set default adddress
  async setDefaultAddress(res: Response, req: Request, sellerId: String) {
    try {
      const { type, id } = req.body;
      const seller = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });

      if (!seller) {
        res.status(200).send({
          status: 'error',
          message: 'sellor not found',
        });

        return;
      }

      if (type === 'shipment') {
        const seller = await this.SellerDocumentModel.findOneAndUpdate(
          {
            sellerId: sellerId,
          },
          {
            $set: {
              defaultShipping: id,
            },
          },
        );

        res.status(200).send({
          status: 'success',
          message: 'Default Shipping address changed',
        });

        return;
      } else if (type === 'billing') {
        const seller = await this.SellerDocumentModel.findOneAndUpdate(
          {
            sellerId: sellerId,
          },
          {
            $set: {
              defaultBilling: id,
            },
          },
        );

        res.status(200).send({
          status: 'success',
          message: 'Default Shipping address changed',
        });

        return;
      }

      res.status(404).send({
        status: 'error',
        message: 'some error occured',
      });
      return;
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // get seller details
  async getSellerDetails(res: Response, req) {
    try {
      const users: any = req.user;
      const sellerId = users.sellerId;
      const seller = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      if (!seller) {
        return res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
      }
      return res.status(200).send({
        status: 'success',
        message: 'seller is found',
        details: seller,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // update seller documents
  async updateSellerDocs(
    res: Response,
    sellerId: string,
    updateDto: updateSellerdetailsDto,
  ) {
    try {
      const { concernPerson, mobileNo, alternateMobileNo, alternateEmailId } =
        updateDto;
      const seller = await this.SellerDocumentModel.findOne({ sellerId });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      if (concernPerson) seller.concernPerson = concernPerson;
      if (mobileNo) seller.mobileNo = mobileNo;
      if (alternateMobileNo) seller.alternateMobileNo = alternateMobileNo;
      if (alternateEmailId) seller.alternateEmailId = alternateEmailId;
      await seller.save();
      res.status(201).send({
        status: 'success',
        message: 'seller details successfully updated',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // this function is gonna upload file to imagekit

  async uploadFilesToImageKit(files, sellerId) {
    const uploadedFiles = await Promise.all([
      files.gstFile && files.gstFile[0]
        ? this.uploadFileToImageKit(files.gstFile[0], sellerId, 'GST_FILES')
        : null,
      files.msmeFile && files.msmeFile[0]
        ? this.uploadFileToImageKit(files.msmeFile[0], sellerId, 'MSME_FILE')
        : null,
      files.logoFile && files.logoFile[0]
        ? this.uploadFileToImageKit(files.logoFile[0], sellerId, 'LOGO')
        : null,
      files.chequeFile && files.chequeFile[0]
        ? this.uploadFileToImageKit(
            files.chequeFile[0],
            sellerId,
            'CANCEL_CHEQUE',
          )
        : null,
    ]);

    // Filter out null values (files that don't exist)

    // Create an object to store the results
    const result: any = {};

    // Assign the results to the corresponding keys in the result object
    if (files.gstFile && files.gstFile[0] && uploadedFiles[0]) {
      result.gstFile = {
        fileId: uploadedFiles[0].fileId,
        url: uploadedFiles[0].url,
      };
    }

    if (files.msmeFile && files.msmeFile[0] && uploadedFiles[1]) {
      result.msmeFile = {
        fileId: uploadedFiles[1].fileId,
        url: uploadedFiles[1].url,
      };
    }

    if (files.logoFile && files.logoFile[0] && uploadedFiles[2]) {
      result.logoFile = {
        fileId: uploadedFiles[2].fileId,
        url: uploadedFiles[2].url,
      };
    }

    if (files.chequeFile && files.chequeFile[0] && uploadedFiles[3]) {
      result.chequeFile = {
        fileId: uploadedFiles[3].fileId,
        url: uploadedFiles[3].url,
      };
    }

    return result;
  }

  // this is gonna return fileId and url to save this in database
  async uploadFileToImageKit(
    file: Express.Multer.File,
    sellerId: string,
    folder: string,
  ) {
    return new Promise<{ fileId: string; url: string }>((resolve, reject) => {
      const folderPath = `${process.env.IMAGEKIT_FOLDER}/WholeSeller/${folder}/${sellerId}`;
      imagekit.upload(
        {
          file: file.buffer,
          fileName: file.originalname,
          folder: folderPath,
        },
        (error: any, result: { fileId: any; url: any }) => {
          if (error) {
            reject(error);
          } else {
            resolve({ fileId: result.fileId, url: result.url });
          }
        },
      );
    });
  }

  // get for adminseller details
  async getSellerDetailsadmin(res: Response, sellerId) {
    try {
      const seller = await this.SellerDocumentModel.findOne({
        sellerId: sellerId,
      });
      return res.status(200).send({
        status: 'success',
        message: 'seller is found',
        details: seller,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
