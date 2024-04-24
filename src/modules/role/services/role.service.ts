import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from '../dto';
import { Role } from '../entities';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  public async create(createRole: CreateRoleDto): Promise<RoleDto> {
    try {
      const roleAlreadyExists = await this.findByName(createRole.name);

      if (roleAlreadyExists) {
        throw new InternalServerErrorException('Role already exists');
      }

      const role = this.roleRepository.create(createRole);
      const dbRole = await this.roleRepository.save(role);

      return plainToInstance(RoleDto, dbRole);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.message === 'Role already exists') {
        throw error;
      } else {
        throw new InternalServerErrorException('Error trying to create role');
      }
    }
  }

  public async findAll(): Promise<RoleDto[]> {
    try {
      const roles = await this.roleRepository.find();

      return plainToInstance(RoleDto, roles);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error trying to list roles');
    }
  }

  public async findById(id: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ id });

      if (!role) throw new NotFoundException('Role not found');

      return role;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.message === 'Role not found') {
        throw error;
      } else {
        throw new InternalServerErrorException('Error trying to get role');
      }
    }
  }

  public async findByName(name: string): Promise<Role> {
    try {
      return await this.roleRepository.findOneBy({ name });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error trying to get role');
    }
  }

  public async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findById(id);

    const roleUpdated: Role = {
      ...role,
      ...updateRoleDto,
    };

    try {
      await this.roleRepository.save(roleUpdated);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error trying to update role');
    }

    return roleUpdated;
  }

  public async remove(id: string) {
    const role = await this.findById(id);

    await this.roleRepository.remove(role);
  }
}
