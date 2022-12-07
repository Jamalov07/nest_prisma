import { IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  releaseDate?: Date;
  @IsOptional()
  artistId: number;
  @IsOptional()
  @IsString()
  genre: string;
}
