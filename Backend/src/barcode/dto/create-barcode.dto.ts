import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { callbackPromise } from "nodemailer/lib/shared";

export class GenerateBarcodeDto {
    @IsArray()
    @IsString({each:true})
    SKUs:string[]
}

export class DeleteBarcodeDto{
    @IsString()
    SNo:string
}

export class BarcodeDto{
    @IsString()
    SKU:string

    @IsArray()
    Sno:string[]
}

export class DeleteBarcodeInBulkDto{
    CustomerName:string;
    MobileNo:number;
    InvoiceNo:string;
    @ValidateNested({ each: true })
    @IsArray()
    @IsNotEmpty()
    barcodes: BarcodeDto[];
}

export class ReturnBarcodeDto{
    @ValidateNested({ each: true })
    @IsArray()
    @IsNotEmpty()
    barcodes: BarcodeDto[];
}


export class verifyProductDto{
    @IsArray()
    Sno:string[]
}

export class globalBarcodeDto{
    @IsString()
    Sno:string;
}