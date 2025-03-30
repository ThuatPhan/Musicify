import { uploadToCloudinary } from "@src/configs/CloudinaryConfig";
import redis from "@src/configs/RedisConfig";
import prisma from "@src/database/PrismaClient";
import ArtistDTO from "@src/dtos/ArtistDTO";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";
import { Artist } from "@src/schemas/ArtistSchema";

class ArtistService {
  private cacheKey = "artists";

  async createArtist(
    artist: Artist,
    avatarFile?: Express.Multer.File
  ): Promise<ArtistDTO> {
    if (!avatarFile) {
      throw new AppError(ErrorType.BAD_REQUEST, "Avatar file is required");
    }

    if (await this.isArtistNameExisted(artist)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Artist name existed");
    }

    const uploadResponse = await uploadToCloudinary(avatarFile);
    const avatarUrl = uploadResponse.secure_url;

    const newArtist = await prisma.artist.create({
      data: {
        ...artist,
        avatar: avatarUrl,
        dateOfBirth: new Date(artist.dateOfBirth),
      },
    });

    await redis.del(`${this.cacheKey}`);
    await redis.set(
      `${this.cacheKey}:${newArtist.id}`,
      JSON.stringify(newArtist),
      "EX",
      120
    );

    return ArtistDTO.fromEntity(newArtist);
  }

  async getArtist(id: string): Promise<ArtistDTO> {
    const cachedArtist = await redis.get(`${this.cacheKey}:${id}`);
    if (cachedArtist) {
      return JSON.parse(cachedArtist);
    }

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new AppError(ErrorType.NOT_FOUND, "Artist not found");
    }

    await redis.set(
      `${this.cacheKey}:${artist.id}`,
      JSON.stringify(artist),
      "EX",
      120
    );

    return ArtistDTO.fromEntity(artist);
  }

  async getArtists(): Promise<ArtistDTO[]> {
    const cachedArtists = await redis.get(this.cacheKey);
    if (cachedArtists) {
      return JSON.parse(cachedArtists);
    }

    const artists = await prisma.artist.findMany({
      orderBy: { id: "desc" },
    });

    await redis.set(this.cacheKey, JSON.stringify(artists), "EX", 60);

    return ArtistDTO.fromEntities(artists);
  }

  async updateArtist(
    id: string,
    artist: Artist,
    avatarFile?: Express.Multer.File
  ): Promise<ArtistDTO> {
    const existingArtist = await prisma.artist.findUnique({ where: { id } });

    if (!existingArtist) {
      throw new AppError(ErrorType.NOT_FOUND, "Artist not found");
    }

    if (await this.isArtistNameExisted(artist, existingArtist.id)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Artist name existed");
    }

    let avatarUrl = existingArtist.avatar;
    if (avatarFile) {
      const uploadResponse = await uploadToCloudinary(avatarFile);
      avatarUrl = uploadResponse.secure_url;
    }

    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: {
        ...artist,
        avatar: avatarUrl,
        dateOfBirth: new Date(artist.dateOfBirth),
      },
    });

    await redis.del(this.cacheKey);
    await redis.del(`${this.cacheKey}:${id}`);

    await redis.set(
      `${this.cacheKey}:${id}`,
      JSON.stringify(updatedArtist),
      "EX",
      120
    );

    return ArtistDTO.fromEntity(updatedArtist);
  }

  private async isArtistNameExisted(artist: Artist, id?: string) {
    return !!(await prisma.artist.findFirst({
      where: { name: artist.name, ...(id ? { id: { not: id } } : {}) },
    }));
  }
}

export default new ArtistService();
