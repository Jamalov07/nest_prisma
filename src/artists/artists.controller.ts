import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/create-artist.dto';

@Controller('artists')
export class ArtistsController {
    constructor(private readonly artistService:ArtistsService ) {}

    @Get()
    getAll() {
      return this.artistService.getAll();
    }
  
    @Get(':id')
    getOne(@Param('id') id: number) {
      return this.artistService.getOne(id);
    }
  
    @Post()
    create(@Body() artistBody: ArtistDto) {
      return this.artistService.create(artistBody);
    }
  
    @Put(':id')
    update(@Param('id') id: number, artistBody: ArtistDto) {
      return this.artistService.update(id, artistBody);
    }
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.artistService.delete(id);
    }
}
