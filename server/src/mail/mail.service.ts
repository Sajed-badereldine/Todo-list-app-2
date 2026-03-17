import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly fromAddress: string;
  private readonly clientUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: Number(this.configService.getOrThrow<string>('MAIL_PORT')),
      secure: Number(this.configService.getOrThrow<string>('MAIL_PORT')) === 465,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
    this.fromAddress = this.configService.getOrThrow<string>('MAIL_FROM');
    this.clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${this.clientUrl}/verify-email?token=${encodeURIComponent(token)}`;

    await this.sendMail({
      to: email,
      subject: 'Verify your email',
      text: `Hi ${name}, verify your email by visiting ${verificationUrl}. This link expires in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">Verify your email</h2>
          <p>Hi ${name},</p>
          <p>Thanks for signing up. Please verify your email to activate your Todo account.</p>
          <p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; background: #14532d; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Verify email
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${this.clientUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.sendMail({
      to: email,
      subject: 'Reset your password',
      text: `Hi ${name}, reset your password by visiting ${resetUrl}. This link expires in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">Reset your password</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Use the link below to choose a new password.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 8px;">
              Reset password
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: this.fromAddress,
      ...options,
    });

    this.logger.log(`Mail sent to ${options.to} with subject "${options.subject}"`);
  }
}
