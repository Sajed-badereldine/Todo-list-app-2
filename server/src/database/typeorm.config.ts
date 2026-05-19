import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Todo } from '../todos/entities/todo.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.getOrThrow<string>('DATABASE_URL'),
    entities: [User, Todo],
    migrations: ['dist/database/migrations/*.js'],
    autoLoadEntities: false,
    synchronize: false,
    logging: false,
  }),
};
