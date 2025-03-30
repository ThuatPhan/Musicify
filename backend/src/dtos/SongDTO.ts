import {
  Expose,
  plainToInstance,
  Transform,
  TransformFnParams,
} from "class-transformer";
import GenreDTO from "@src/dtos/GenreDTO";
import ArtistDTO from "./ArtistDTO";
import { Song, Artist } from "@prisma/client";

export default class SongDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  sourceUrl!: string;

  @Expose()
  coverImageUrl!: string;

  @Expose()
  duration!: number;

  @Expose()
  releaseDate!: Date;

  @Expose()
  @Transform(({ value }: TransformFnParams) => plainToInstance(GenreDTO, value))
  genre!: GenreDTO;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value instanceof ArtistDTO ? value : plainToInstance(ArtistDTO, value)
  )
  artist!: ArtistDTO;

  static fromEntity(song: Song & { artist: Artist | ArtistDTO }) {
    return plainToInstance(SongDTO, song, { excludeExtraneousValues: true });
  }

  static fromEntities(songs: (Song & { artist: Artist | ArtistDTO })[]) {
    return plainToInstance(SongDTO, songs, { excludeExtraneousValues: true });
  }
}
