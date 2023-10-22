import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// custorm type validator
@ValidatorConstraint({ name: 'mobileNoLength', async: false })
class MobileNoLengthValidator implements ValidatorConstraintInterface {
  validate(mobileNo: number, args: ValidationArguments) {
    if (mobileNo === undefined || mobileNo === null) {
      return false;
    }
    const mobileNoString = mobileNo.toString();
    return mobileNoString.length === 10;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid mobile no';
  }
}

@ValidatorConstraint({ name: 'pincodeLength', async: false })
class PincodeLengthValidator implements ValidatorConstraintInterface {
  validate(pincode: number, args: ValidationArguments) {
    if (pincode === undefined || pincode === null) {
      return false;
    }
    const pincodeString = pincode.toString();
    return pincodeString.length === 6;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid Pincode';
  }
}

// for adding seller type
export class SellerDocumentDto {
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'Pincode Required' })
  @Validate(PincodeLengthValidator)
  pincode: number;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  addressLine1: string;

  @IsString()
  addressLine2: string;

  @IsString()
  @IsNotEmpty({ message: 'SellerId Required' })
  sellerId: string;

  @IsString()
  @IsNotEmpty({ message: 'Person Name Required' })
  concernPerson: string;

  @IsNotEmpty({ message: 'Mobile No Required' })
  @Validate(MobileNoLengthValidator)
  mobileNo: number;

  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Gst Required' })
  gst: string;

  msme: string;
  // @IsNotEmpty({ message: 'GstFile is required' })
  gstFile: string;

  msmeFile: string;

  @IsNotEmpty({ message: 'CompanyName is required' })
  companyName: string;

  @IsNotEmpty({ message: 'CompanyType is required' })
  companyType: string;

  @IsNotEmpty({ message: 'Bank Name  is required' })
  bankName: string;

  @IsNotEmpty({ message: 'Account No  is required' })
  accountNumber: number;

  accountType: string;
  alternateCompanyName: string;
  bankBranch: string;

  @IsNotEmpty({ message: 'Ifsc code is required' })
  ifscCode: string;
  @IsNotEmpty({ message: 'Name of Beneficiary is required' })
  nameOfBeneficiary: string;
  alternateMobileNo: number;
  alternateEmailId: string;
  cancelCheque: string;
  companyLogo: string;
}

export class SellerAddessDto {
  sellerId: string;
  name: string;
  mobileNo: number;
  city: string;
  pincode: number;
  state: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
}

export class UpdateSellerAddressDto {
  sellerId: string;
  name: string;
  mobileNo: number;
  city: string;
  pincode: number;
  state: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
}
export class updateSellerdetailsDto {
  concernPerson: string;
  mobileNo: number;
  alternateMobileNo: number;
  alternateEmailId: string;
}
