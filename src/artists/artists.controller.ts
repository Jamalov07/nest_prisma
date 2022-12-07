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
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/create-artist.dto';
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Public()
  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.artistService.getOne(id);
  }

  @UseGuards(UserGuard)
  @Post()
  create(@Body() artistBody: ArtistDto) {
    return this.artistService.create(artistBody);
  }

  @UseGuards(UserGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() artistBody: ArtistDto) {
    return this.artistService.update(id, artistBody);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.artistService.delete(id);
  }
}
