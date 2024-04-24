import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { RoleModule } from '../role/role.module';
import { UsersController } from './controller';
import { User } from './entities';
import { UserService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, LoggerModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
