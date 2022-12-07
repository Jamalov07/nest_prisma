import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    const users = await this.prismaService.user.findMany();
    if (!users.length) {
      throw new BadRequestException('users not found');
    }
    // console.log(users);
    return users;
  }

  async getOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: +id },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    return user;
  }

  async delete(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    return { message: 'user deleted', user };
  }
}
