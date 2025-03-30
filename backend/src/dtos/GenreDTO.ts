import { Expose, plainToInstance } from "class-transformer";
import { Genre } from "@prisma/client";

export default class GenreDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  static fromEntity(genre: Genre): GenreDTO {
    return plainToInstance(GenreDTO, genre);
  }

  static fromEntities(genres: Genre[]): GenreDTO[] {
    return plainToInstance(GenreDTO, genres);
  }
}
