import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../common/decorators';
import { UserGuard } from '../common/guards/UserActivate.guard';
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Public()
  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.albumService.getOne(id);
  }

  @UseGuards(UserGuard)
  @Post()
  create(@Body() albumBody: AlbumDto) {
    return this.albumService.create(albumBody);
  }

  @UseGuards(UserGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() albumBody: UpdateAlbumDto) {
    return this.albumService.update(id, albumBody);
  }
  @UseGuards(UserGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.albumService.delete(id);
  }
}
