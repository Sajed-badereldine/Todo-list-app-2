import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const GENERIC_RESET_RESPONSE = 'If an account with that email exists, a reset link has been sent';
const GENERIC_VERIFICATION_RESPONSE =
  'If an account with that email exists and is not yet verified, a verification link has been sent';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = this.generateRawToken();
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: this.hashToken(verificationToken),
      emailVerificationExpires: this.createExpiry(EMAIL_VERIFICATION_TTL_MS),
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    await this.mailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return {
      message: 'Account created. Please check your email to verify your account.',
      user: this.usersService.toSafeUser(user),
    };
  }

  async register(registerDto: RegisterDto) {
    return this.signup(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const safeUser = this.usersService.toSafeUser(user);

    return {
      access_token: await this.signToken({
        sub: safeUser.id,
        email: safeUser.email,
      }),
      user: safeUser,
    };
  }

  async verifyEmail({ token }: VerifyEmailDto) {
    const user = await this.usersService.findByEmailVerificationToken(this.hashToken(token));

    if (!user) {
      throw new BadRequestException('This verification link is invalid or has expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await this.usersService.save(user);

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  async resendVerificationEmail({ email }: ResendVerificationDto) {
    const user = await this.usersService.findByEmail(email, true);

    if (!user || user.isEmailVerified) {
      return {
        message: GENERIC_VERIFICATION_RESPONSE,
      };
    }

    const verificationToken = this.generateRawToken();
    user.emailVerificationToken = this.hashToken(verificationToken);
    user.emailVerificationExpires = this.createExpiry(EMAIL_VERIFICATION_TTL_MS);

    await this.usersService.save(user);
    await this.mailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return {
      message: GENERIC_VERIFICATION_RESPONSE,
    };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email, true);

    if (!user) {
      return {
        message: GENERIC_RESET_RESPONSE,
      };
    }

    const resetToken = this.generateRawToken();
    user.passwordResetToken = this.hashToken(resetToken);
    user.passwordResetExpires = this.createExpiry(PASSWORD_RESET_TTL_MS);

    await this.usersService.save(user);
    await this.mailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    return {
      message: GENERIC_RESET_RESPONSE,
    };
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(this.hashToken(token));

    if (!user) {
      throw new BadRequestException('This password reset link is invalid or has expired');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.usersService.save(user);

    return {
      message: 'Password reset successful. You can now log in with your new password.',
    };
  }

  private signToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  private generateRawToken() {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private createExpiry(durationMs: number) {
    return new Date(Date.now() + durationMs);
  }
}
