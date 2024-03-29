import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto';
import { JwtPayload, Tokens } from './types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(authDto: AuthDto, res: Response): Promise<Tokens> {
    const candidate = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (candidate) {
      throw new BadRequestException('Bunday email mavjud');
    }
    const hashedPassword = await bcrypt.hash(authDto.password, 7);
    const newUser = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        hashedPassword,
      },
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }

  async signin(authDto: AuthDto, res: Response): Promise<Tokens> {
    const { email, password } = authDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }

  async update(id: number, authDto: AuthDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { id: +id },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const candidate = await this.prismaService.user.findUnique({
      where: { email:authDto.email },
    });
    if (candidate && candidate.id != id) {
      throw new BadRequestException('bunnday email mavjud');
    }
    const updatedUser = await this.prismaService.user.update({
      where: { id: +id },
      data: authDto,
    });
    const tokens = await this.getTokens(updatedUser.id, updatedUser.email);
    await this.updateRefreshTokenHash(updatedUser.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { tokens,user:updatedUser };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
    res: Response,
  ): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const rMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!rMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }

  async logout(userId: number, res: Response) {
    const user = await this.prismaService.user.updateMany({
      where: {
        id: Number(userId),
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    res.clearCookie('refresh_token');
    if (!user) throw new ForbiddenException('access denied');
    return true;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken: hashedRefreshToken,
      },
    });
  }
}
