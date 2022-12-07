import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { Public } from '../common/decorators';
import { UserGuard } from '../common/guards/UserActivate.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: number) {
    console.log(id);
    return this.userService.getOne(id);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
