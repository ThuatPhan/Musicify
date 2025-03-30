import { Expose, plainToInstance } from "class-transformer";
import { Sex, Artist } from "@prisma/client";

export default class ArtistDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  avatar!: string;

  @Expose()
  dateOfBirth!: Date;

  @Expose()
  sex!: Sex;

  static fromEntity(artist: Artist) {
    return plainToInstance(ArtistDTO, artist, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities(artists: Artist[]) {
    return plainToInstance(ArtistDTO, artists, {
      excludeExtraneousValues: true,
    });
  }
}
