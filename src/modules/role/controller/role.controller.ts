import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dto';
import { RoleService } from '../services';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({
    operationId: 'create_role',
    description: 'Create a new role',
  })
  @ApiOkResponse({
    description: 'Successfully created a new role',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get('find/id/:id')
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: 'Was not able to find role',
  })
  findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Get('find/name/:name')
  findByEmail(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
