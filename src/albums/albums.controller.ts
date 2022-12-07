import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.albumService.getOne(id);
  }

  @Post()
  create(@Body() albumBody: AlbumDto) {
    return this.albumService.create(albumBody);
  }

  @Put(':id')
  update(@Param('id') id: number, albumBody: UpdateAlbumDto) {
    return this.albumService.update(id, albumBody);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.albumService.delete(id);
  }
}
