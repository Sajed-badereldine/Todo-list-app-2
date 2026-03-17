import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, MoreThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto &
      Pick<
        User,
        | 'isEmailVerified'
        | 'emailVerificationToken'
        | 'emailVerificationExpires'
        | 'passwordResetToken'
        | 'passwordResetExpires'
      >,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
      select: ['id'],
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const baseSelect: FindOptionsSelect<User> = {
      id: true,
      name: true,
      email: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    };

    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      select: includePassword
        ? {
            ...baseSelect,
            password: true,
            emailVerificationToken: true,
            emailVerificationExpires: true,
            passwordResetToken: true,
            passwordResetExpires: true,
          }
        : baseSelect,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date()),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        emailVerificationToken: true,
        emailVerificationExpires: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isEmailVerified: true,
        passwordResetToken: true,
        passwordResetExpires: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  toSafeUser(
    user: Pick<User, 'id' | 'name' | 'email' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>,
  ): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
