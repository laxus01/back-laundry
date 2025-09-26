import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Post()
    async createUser(@Body() user: CreateUserDto) {
        return this.usersService.createUser(user);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
        return this.usersService.updateUser(id, user);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
