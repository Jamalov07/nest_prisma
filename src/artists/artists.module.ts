import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import {
  AccessTokenStrategy,
  RefreshTokenFromBearerStrategy,
  RefreshTokenFromCookiesStrategy,
} from '../auth/strategies';
import { AccessTokenGuard } from '../common/guards';
import { PrismaModule } from '../prisma/prisma.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
