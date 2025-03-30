import redis from "@src/configs/RedisConfig";
import prisma from "@src/database/PrismaClient";
import { Genre } from "@src/schemas/GenreSchema";
import GenreDTO from "@src/dtos/GenreDTO";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";

class GenreService {
  private cacheKey = "genres";

  async createGenre(genre: Genre): Promise<GenreDTO> {
    if (await this.isGenreNameExisted(genre)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Genre name existed");
    }

    const createdGenre = await prisma.genre.create({ data: genre });

    await redis.del(this.cacheKey);
    await redis.set(
      `${this.cacheKey}:${createdGenre.id}`,
      JSON.stringify(createdGenre),
      "EX",
      120
    );

    return GenreDTO.fromEntity(createdGenre);
  }

  async getGenre(id: string): Promise<GenreDTO> {
    const cachedGenre = await redis.get(`${this.cacheKey}:${id}`);
    if (cachedGenre) {
      return JSON.parse(cachedGenre);
    }

    const genre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new AppError(ErrorType.NOT_FOUND, "Genre not found");
    }

    await redis.set(
      `${this.cacheKey}:${genre.id}`,
      JSON.stringify(genre),
      "EX",
      120
    );

    return GenreDTO.fromEntity(genre);
  }

  async getGenres(): Promise<GenreDTO[]> {
    const cachedGenres = await redis.get(this.cacheKey);
    if (cachedGenres) {
      return JSON.parse(cachedGenres);
    }

    const genres = await prisma.genre.findMany();

    await redis.set(this.cacheKey, JSON.stringify(genres), "EX", 60);

    return GenreDTO.fromEntities(genres);
  }

  async updateGenre(id: string, genre: Genre): Promise<GenreDTO> {
    const existingGenre = await prisma.genre.findUnique({ where: { id } });
    if (!existingGenre) {
      throw new AppError(ErrorType.NOT_FOUND, "Genre not found");
    }

    if (await this.isGenreNameExisted(genre, existingGenre.id)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Genre name existed");
    }

    const updatedGenre = await prisma.genre.update({
      where: { id },
      data: genre,
    });

    await redis.del(this.cacheKey);
    await redis.del(`${this.cacheKey}:${id}`);
    await redis.set(
      `${this.cacheKey}:${id}`,
      JSON.stringify(updatedGenre),
      "EX",
      120
    );

    return GenreDTO.fromEntity(updatedGenre);
  }

  async deleteGenre(id: string): Promise<void> {
    const genreExist = await prisma.genre.findUnique({ where: { id } });
    if (!genreExist) {
      throw new AppError(ErrorType.BAD_REQUEST, "Genre not found");
    }
    await prisma.genre.delete({
      where: { id: genreExist.id },
    });
    await redis.del(this.cacheKey);
    await redis.del(`${this.cacheKey}:${id}`);
  }

  private async isGenreNameExisted(genre: Genre, id?: string) {
    return !!(await prisma.genre.findFirst({
      where: {
        name: genre.name,
        ...(id ? { id: { not: id } } : {}),
      },
    }));
  }
}

export default new GenreService();
