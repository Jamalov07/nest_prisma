import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
