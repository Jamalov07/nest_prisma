import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prismaService: PrismaService) {}
  async getAll() {
    const albums = await this.prismaService.album.findMany();
    console.log(albums);
    return albums;
  }

  async getOne(id: number) {
    const album = await this.prismaService.album.findUnique({
      where: { id: +id },
    });
    if (!album) {
      throw new BadRequestException('Album not found');
    }
    return album;
  }

  async create(albumBody: AlbumDto) {
    const candidate = await this.prismaService.album.findUnique({
      where: { name: albumBody.name },
    });
    if (candidate) {
      throw new BadRequestException('bunday album bor');
    }
    const newAlbum = await this.prismaService.album.create({ data: albumBody });
    return newAlbum;
  }

  async update(id: number, albumBody: UpdateAlbumDto) {
    const candidate = await this.prismaService.album.findUnique({
      where: { name: albumBody.name },
    });
    if (candidate && candidate.id != +id) {
      throw new BadRequestException(
        `${albumBody.name} nomli album allaqachon bor`,
      );
    }
    const updatedAlbum = await this.prismaService.album.update({
      where: { id: +id },
      data: albumBody,
    });
    if (!updatedAlbum) {
      throw new BadRequestException('update qila olmadik');
    }
    return updatedAlbum;
  }

  async delete(id: number) {
    const album = await this.prismaService.album.findUnique({
      where: { id: +id },
    });
    if (!album) {
      throw new BadRequestException('album not found');
    }
    await this.prismaService.album.delete({ where: { id: +id } });

    return { message: 'album deleted', album };
  }
}
