import { IsNotEmpty, IsString } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  // @IsNotEmpty()
  releaseDate?: Date;
  @IsNotEmpty()
  artistId: number;
  @IsNotEmpty()
  @IsString()
  genre: string;
}
