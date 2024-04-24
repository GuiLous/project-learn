import { CryptoUtil } from '@/common/utils';
import { LoggerService } from '@/modules/logger/services';
import { RoleService } from '@/modules/role/services';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto';
import { User } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(UserService.name);
  }

  public async create(createUser: CreateUserDto): Promise<UserDto> {
    try {
      const userAlreadyExists = await this.findByEmail(createUser.email);

      if (userAlreadyExists) {
        throw new InternalServerErrorException('User already exists');
      }

      createUser.salt = await CryptoUtil.generateSalt();

      createUser.password = await CryptoUtil.hashPassword(
        createUser.password,
        createUser.salt,
      );

      const rolePromises = [];

      for (const role of createUser.roles) {
        const promise = this.roleService.findById(role);

        rolePromises.push(promise);
      }

      let roles = [];
      if (rolePromises.length > 0) {
        roles = await Promise.all(rolePromises);
      }

      const userWithRoles = {
        ...createUser,
        roles,
      };

      const user = this.userRepository.create(userWithRoles);
      const dbUser = await this.userRepository.save(user);

      return plainToInstance(UserDto, dbUser);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);

      if (error.response && error.response.message === 'User already exists') {
        throw error;
      } else {
        throw new InternalServerErrorException('Error trying to create user');
      }
    }
  }

  public async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.userRepository.find({
        relations: ['roles'],
      });

      return plainToInstance(UserDto, users);
    } catch (error) {
      throw new InternalServerErrorException('Error trying to list users');
    }
  }

  public async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      if (error.response && error.response.message === 'User not found') {
        throw error;
      } else {
        throw new InternalServerErrorException('Error trying to get user');
      }
    }
  }

  public async findByEmail(email: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['roles'],
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      throw new InternalServerErrorException('Error trying to get user');
    }
  }

  public async findOne(id: string): Promise<UserDto> {
    const user = await this.findById(id);

    return plainToInstance(UserDto, user);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    const userUpdated: User = {
      ...user,
      ...updateUserDto,
      roles: user.roles,
    };

    try {
      await this.userRepository.save(userUpdated);
    } catch (error) {
      throw new InternalServerErrorException('Error trying to update user');
    }

    return userUpdated;
  }

  public async remove(id: string) {
    const user = await this.findById(id);

    try {
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Error trying to remove user');
    }
  }

  public async validateUserPassword(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user)
      throw new UnauthorizedException('the username or password is invalid');

    if (await CryptoUtil.validatePassword(password, user.password))
      return plainToInstance(UserDto, user);

    return null;
  }
}
