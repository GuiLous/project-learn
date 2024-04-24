import { CreateRoleDto } from '@/modules/role/dto';
import { Role } from '@/modules/role/entities';
import { RoleService } from '@/modules/role/services';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { User } from '../entities';
import { UserService } from './user.service';

describe(UserService, () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  let roleService: RoleService;
  let rolesRepository: Repository<Role>;

  const wrong_id = 'wrong_id';
  const wrong_email = 'wrong_email';

  let defaultUser: User;
  let defaultUserDto: CreateUserDto;

  let defaultRole: Role;
  let defaultRoleDto: CreateRoleDto;

  beforeEach(async () => {
    const mockUsersRepository = mock<Repository<User>>();
    const mockRolesRepository = mock<Repository<Role>>();
    const UsersRepositoryToken = getRepositoryToken(User);
    const RolesRepositoryToken = getRepositoryToken(Role);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepositoryToken,
          useValue: mockUsersRepository,
        },
        {
          provide: RolesRepositoryToken,
          useValue: mockRolesRepository,
        },
        UserService,
        RoleService,
      ],
      imports: [],
    }).compile();

    userService = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);

    userRepository = module.get<Repository<User>>(UsersRepositoryToken);
    rolesRepository = module.get<Repository<Role>>(RolesRepositoryToken);

    defaultRole = {
      id: 'random_role_id',
      name: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
    };

    defaultRoleDto = {
      ...defaultRole,
    };

    defaultUser = {
      id: 'random_id',
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'john',
      password: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: `${randomUUID()}@gmail.com`,
      salt: 'saltHast',
      active: true,
      roles: [defaultRole],
    };

    defaultUserDto = {
      ...defaultUser,
      roles: ['random_role_id'],
    };

    jest.spyOn(userRepository, 'create').mockReturnValue(defaultUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(defaultUser);
    jest.spyOn(userRepository, 'find').mockResolvedValue([defaultUser]);
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(defaultUser);
    jest.spyOn(userRepository, 'remove');

    jest.spyOn(rolesRepository, 'findOneBy').mockResolvedValue(defaultRole);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(roleService).toBeDefined();
  });

  describe(UserService.prototype.create, () => {
    it('should create a new user', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);

      const user = await userService.create(defaultUserDto);

      expect(user.id).toBeDefined();
      expect(user.firstName).toBe(defaultUserDto.firstName);
      expect(user.roles).toHaveLength(1);
      expect(user.roles[0].name).toBe(defaultRoleDto.name);
    });

    it('should throw error if user already exists', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(defaultUser);

      await expect(userService.create(defaultUserDto)).rejects.toThrow(
        new InternalServerErrorException('User already exists'),
      );
    });

    it('should throw InternalServerErrorException when an error occurs in create method', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);

      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.create({} as any)).rejects.toThrow(
        new InternalServerErrorException('Error trying to create user'),
      );
    });
  });

  describe(UserService.prototype.findAll, () => {
    it('should list all users', async () => {
      const user = await userService.findAll();

      expect(user).toHaveLength(1);
      expect(user[0].firstName).toBe(defaultUserDto.firstName);
    });

    it('should throw InternalServerErrorException when an error occurs in findAll method', async () => {
      jest.spyOn(userRepository, 'find').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.findAll()).rejects.toThrow(
        new InternalServerErrorException('Error trying to list users'),
      );
    });
  });

  describe(UserService.prototype.findById, () => {
    it('should find user by id', async () => {
      const user = await userService.findById(defaultUser.id);

      expect(user.id).toBeDefined();
      expect(user.firstName).toBe(defaultUserDto.firstName);
    });

    it('should throw error if user not exists', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);

      await expect(userService.findById(wrong_id)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw InternalServerErrorException when an error occurs in findById method', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.findById(wrong_id)).rejects.toThrow(
        new InternalServerErrorException('Error trying to get user'),
      );
    });
  });

  describe(UserService.prototype.findByEmail, () => {
    it('should find user by email', async () => {
      const user = await userService.findByEmail(defaultUser.email);

      expect(user.id).toBeDefined();
      expect(user.firstName).toBe(defaultUserDto.firstName);
    });

    it('should not throw error if user not exists', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);

      const user = await userService.findByEmail(wrong_email);

      expect(user).toBeNull();
    });

    it('should throw InternalServerErrorException when an error occurs in findByEmail method', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.findByEmail(wrong_email)).rejects.toThrow(
        new InternalServerErrorException('Error trying to get user'),
      );
    });
  });

  describe(UserService.prototype.update, () => {
    it('should update a user successfully', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);

      let user = await userService.create(defaultUserDto);

      const newFirstName = 'firstName Update';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(defaultUser);

      user = await userService.update(user.id, {
        firstName: newFirstName,
      });

      expect(user.id).toBeDefined();
      expect(user.lastName).toBe(defaultUserDto.lastName);
      expect(user.firstName).toBe(newFirstName);
    });

    it('should throw InternalServerErrorException when an error occurs in update method', async () => {
      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.update(wrong_id, {})).rejects.toThrow(
        new InternalServerErrorException('Error trying to update user'),
      );
    });
  });

  describe(UserService.prototype.remove, () => {
    it('should remove a user', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(defaultUser);

      await userService.remove(defaultUser.id);
    });

    it('should throw InternalServerErrorException when an error occurs in remove method', async () => {
      jest.spyOn(userRepository, 'remove').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.remove(wrong_id)).rejects.toThrow(
        new InternalServerErrorException('Error trying to remove user'),
      );
    });
  });
});
