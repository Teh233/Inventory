import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtpToCustomer(
    otp: number,
    email: string,
    subject: string,
  ): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: `Your OTP Is: ${otp}`,
      });
      console.log('mail sent');
    } catch (error) {
      // Handle the error
      console.error('Error occurred while sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendResetToken(
    email: string,
    subject: string,
    message: string | any,
  ): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: message,
      });
      console.log('mail sent');
    } catch (error) {
      // Handle the error
      console.error('Error occurred while sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendGreetings(email: string, subject: string,name:string): Promise<void> {
    try {
      const message = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Welcome to Indian Robotics Solution</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              background-image: linear-gradient(
                180deg,
                #fdc50f 26.71%,
                #fb9829 99.3%
              );
              color: white;
              padding: 2px;
              text-align: center;
              border-radius: 25px;
            }
            p {
              font-size: 16px;
              color: black;
              line-height: 1.5;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
            .main {
          
              padding: 0 10px;
            }
      
            .bottom {
              margin-left: 20%;
            }
      
            span {
              background-color: black;
              color: white;
              padding: 7px;
              border-radius: 10px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Indian Robotics Solution</h1>
            <div class="main">
              <p>Dear ${name},</p>
              <p>We are thrilled that you've chosen to explore our offerings.</p>
              <p>
                Your journey into the world of quality and innovation begins here.
              </p>
              <p>
                Inside our catalog, you'll find a wide range of products meticulously
                curated to cater to your needs, desires, and dreams. Whether you're
                searching for the latest in Drone technology or in drone parts, we've
                got you covered.
              </p>
              <p>
                If you need any assistance or have questions, please feel free to
                visit our website for more information:
                <a href="https://www.droneservicecenter.in"
                  >www.droneservicecenter.in</a
                >
              </p>
              <div class="bottom">
                <span>Thank you for choosing us!</span>
              </div>
            </div>
          </div>
        </body>
      </html>
      
      `;

      const mail = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: message,
      });

      console.log('Email sent successfully');
    } catch (error) {
      // Handle the error
      console.error('Error occurred while sending email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}
