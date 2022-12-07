import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    const artists = await this.prismaService.artist.findMany({
      include: { albums: true },
    });
    console.log(artists);
    return artists;
  }

  async getOne(id: number) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id: +id },
    });
    if (!artist) {
      throw new BadRequestException('artist not found');
    }
    return artist;
  }

  async create(artistBody: ArtistDto) {
    const candidate = await this.prismaService.artist.findUnique({
      where: { name: artistBody.name },
    });
    if (candidate) {
      throw new BadRequestException('bunday artist bor');
    }
    const newartist = await this.prismaService.artist.create({
      data: artistBody,
    });
    return newartist;
  }

  async update(id: number, artistBody: ArtistDto) {
    const candidate = await this.prismaService.artist.findUnique({
      where: { name: artistBody.name },
    });
    if (candidate && candidate.id != +id) {
      throw new BadRequestException(
        `${artistBody.name} nomli artist allaqachon bor`,
      );
    }
    const updatedArtist = await this.prismaService.artist.update({
      where: { id: +id },
      data: artistBody,
    });
    if (!updatedArtist) {
      throw new BadRequestException('update qila olmadik');
    }
    return updatedArtist;
  }

  async delete(id: number) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id: +id },
    });
    if (!artist) {
      throw new BadRequestException('artist not found');
    }
    await this.prismaService.artist.delete({ where: { id: +id } });
    return { message: 'artist deleted', artist };
  }
}
