import { createHash, randomBytes } from 'crypto';
import * as pdfkit from 'pdfkit';
import * as path from 'path';

export const generateRandomNumber = (digits: number): number => {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const genRandomToken = () => {
  const resetToken = randomBytes(20).toString('hex');
  return createHash('sha256').update(resetToken).digest('hex');
};

// this is serial numbers for the barcode generation
export const generateSerialNumbers = (
  sku: any,
  startingNumber: string,
  qty: any,
): string[] => {
  const serialNumbers = [];
  const startingDigits = parseInt(startingNumber);
  for (let i = 1; i <= qty; i++) {
    const incrementedDigits = startingDigits + i - 1;
    const formattedNumber = incrementedDigits.toString().padStart(3, '0');
    const serializedNumber = `${sku}${formattedNumber}`;
    serialNumbers.push({
      serialNumber: serializedNumber,
      createdAt: new Date(),
    });
  }
  return serialNumbers;
};

// Function to generate a PDF containing a list of serial numbers
export const PI_PDF_Generator = (data: any, fileName: string, res: any) => {
  /// constant
  let companyLogo = path.join('uploads', 'logo', 'CompanyLogo.jpeg');

  let sellerInfo = {
    companyName: 'INDIAN ROBOTICS SOLUTION PRIVATE LIMITED',
    address: 'G 36 3rd Floor Sector 3 Nearest Metro',
    city: 'Noida',
    state: 'Uttarpradesh',
    pincode: '201301',
    country: 'India',
    contactNo: '+910000000600',
  };

  let footer = 'Indian Robotics Solution Private Limited';

  /// initialize
  const doc = new pdfkit({ bufferPages: true });

  /// create stream
  let buffers = [];

  //////
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment;filename=${fileName}`,
      })
      .end(pdfData);
  });

  /// Add content to the PDF

  /// header company logo and  Company Name
  doc
    .image(companyLogo, 10, 10, { width: 200, height: 120 })
    .fillColor('#444444')
    .fontSize(10)
    .text(sellerInfo.companyName, 240, 20, { align: 'right' })
    .text(sellerInfo.address, 240, 35, { align: 'right' })
    .text(sellerInfo.city + ' ' + sellerInfo.pincode, 240, 50, {
      align: 'right',
    })
    .text(sellerInfo.state, 240, 65, { align: 'right' })
    .moveDown();

  /// about Client and PI number
  generateHr(doc, 185);
  const customerInformationTop = 200;
  doc
    .fontSize(10)
    .text('PO Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(data.PI, 150, customerInformationTop)
    .font('Helvetica')
    .text('Date:', 50, customerInformationTop + 15)
    .text(formatDate(data.date), 150, customerInformationTop + 15)
    .text('Amount:', 50, customerInformationTop + 30)
    .text(data.subTotal, 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(data.vendorDetails.companyName, 300, customerInformationTop)
    .font('Helvetica')
    .text(data.vendorDetails.ConcernPerson, 300, customerInformationTop + 15)
    .moveDown();
  generateHr(doc, 252);

  let i;
  const invoiceTableTop = 270;

  doc.font('Helvetica-Bold');
  // generateTableRow(
  //   doc,
  //   invoiceTableTop,
  //   'SKU',
  //   'Name',
  //   'Quantity',
  //   'UnitPrice',
  //   'Total',
  // );
  doc
    .rect(50, invoiceTableTop, 500, 20)
    .fill('#FC427B')
    .stroke('#FC427B')
    .fontSize(10)
    .fillColor('#fff')
    .text('SKU', 55, invoiceTableTop + 5, { width: 90 })
    .text('Product Name', 150, invoiceTableTop + 5, { width: 190 })
    .text('Qty', 360, invoiceTableTop + 5, { width: 100 })
    .text('Price', 435, invoiceTableTop + 5, { width: 100 })
    .text('Total Price', 490, invoiceTableTop + 5, { width: 100 });
  generateHr(doc, invoiceTableTop + 20);

  doc.font('Helvetica');
  for (i = 0; i < data.products.length; i++) {
    const item = data.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.SKU,
      item.Name,
      item.NewQuantity,
      item.Price,
      item.Price * item.NewQuantity,
    );

    generateHr(doc, position + 20);
  }
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    '',
    'Subtotal',
    data.subTotal,
  );
  doc
    .fontSize(10)
    .text(footer.toUpperCase(), 50, 700, { align: 'center', width: 500 });
  doc.end();
};

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}

function generateTableRow(doc, y, SKU, Name, Quantity, UnitPrice, Total) {
  doc
    .fillColor('#000000')
    .fontSize(10)
    .text(SKU, 50, y)
    .text(Name, 150, y)
    .text(Quantity, 280, y, { width: 90, align: 'right' })
    .text(UnitPrice, 370, y, { width: 90, align: 'right' })
    .text(Total, 0, y, { align: 'right' });
}
