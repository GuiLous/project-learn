import { IsUUIDParam } from '@/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserService } from '../services';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    operationId: 'user_create',
    description: 'Create a new user',
  })
  @ApiOkResponse({ description: 'User created successfully' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('find/id/:id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('find/email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  update(@IsUUIDParam('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@IsUUIDParam('id') id: string) {
    return this.userService.remove(id);
  }
}
