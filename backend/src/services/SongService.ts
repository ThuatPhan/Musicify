import redis from "@src/configs/RedisConfig";
import prisma from "@src/database/PrismaClient";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";
import { Song } from "@src/schemas/SongSchema";
import GenreService from "@src/services/GenreService";
import SongDTO from "@src/dtos/SongDTO";
import FileService from "@src/services/FileService";
import ArtistService from "./ArtistService";
import { uploadToCloudinary } from "@src/configs/CloudinaryConfig";
import { Lrc } from "lrc-kit";

class SongService {
  private cacheKey = "songs";

  async createSong(
    song: Song,
    files?:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
  ): Promise<SongDTO> {
    if (await this.isSongNameExisted(song)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Song name existed");
    }

    const sourceFile = FileService.getFileByKey(files, "source")!;
    const coverFile = FileService.getFileByKey(files, "coverImage")!;
    const lyricFile = FileService.getFileByKey(files, "lyricFile")!;

    const responses = await Promise.all([
      uploadToCloudinary(sourceFile),
      uploadToCloudinary(coverFile),
      uploadToCloudinary(lyricFile),
    ]);

    const sourceUrl = responses[0].secure_url;
    const coverImageUrl = responses[1].secure_url;
    const lyricUrl = responses[2].secure_url;

    const duration = await FileService.getAudioDuration(sourceFile);

    const genre = await GenreService.getGenre(song.genreId);
    const artist = await ArtistService.getArtist(song.artistId);

    if (!artist) {
      throw new AppError(ErrorType.NOT_FOUND, "Artist not found");
    }

    const newSong = await prisma.song.create({
      data: {
        name: song.name,
        genreId: genre.id,
        duration,
        sourceUrl,
        coverImageUrl,
        lyricUrl,
        artistId: artist.id,
      },
    });

    await redis.del(this.cacheKey);
    await redis.del(`${this.cacheKey}:artist:${artist.id}`);

    await redis.set(
      `${this.cacheKey}:${newSong.id}`,
      JSON.stringify(newSong),
      "EX",
      120
    );

    return SongDTO.fromEntity({ ...newSong, artist });
  }

  async getSong(id: string) {
    const cacheKey = `${this.cacheKey}:${id}`;

    const cachedSong = await redis.get(cacheKey);
    if (cachedSong) {
      return JSON.parse(cachedSong);
    }

    const song = await prisma.song.findUnique({
      where: { id },
      include: { genre: true, artist: true },
    });

    if (!song) {
      throw new AppError(ErrorType.NOT_FOUND, "Song not found");
    }

    await redis.set(cacheKey, JSON.stringify(song), "EX", 120);

    return SongDTO.fromEntity(song);
  }

  async getSongs() {
    const cachedSongs = await redis.get(this.cacheKey);
    if (cachedSongs) {
      return JSON.parse(cachedSongs);
    }

    const songs = await prisma.song.findMany({
      include: { genre: true, artist: true },
    });

    await redis.set(this.cacheKey, JSON.stringify(songs), "EX", 60);

    return SongDTO.fromEntities(songs);
  }

  async getSongsByArtist(artistId: string): Promise<SongDTO[]> {
    const cacheKey = `${this.cacheKey}:artist:${artistId}`;

    const cachedSongs = await redis.get(cacheKey);
    if (cachedSongs) {
      return JSON.parse(cachedSongs);
    }

    const artistExisting = await prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artistExisting) {
      throw new AppError(ErrorType.NOT_FOUND, "Artist not found");
    }

    const songs = await prisma.song.findMany({
      where: { artistId },
      include: { artist: true, genre: true },
    });

    await redis.set(cacheKey, JSON.stringify(songs), "EX", 120);

    return SongDTO.fromEntities(songs);
  }

  async updateSong(
    id: string,
    song: Song,
    files?:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
  ): Promise<SongDTO> {
    const existingSong = await prisma.song.findUnique({ where: { id } });
    if (!existingSong) {
      throw new AppError(ErrorType.NOT_FOUND, "Song not found");
    }

    if (await this.isSongNameExisted(song, existingSong.artistId)) {
      throw new AppError(ErrorType.BAD_REQUEST, "Song name existed");
    }

    const sourceFile = FileService.getFileByKey(files, "source", false);
    const coverFile = FileService.getFileByKey(files, "coverImage", false);
    const lyricFile = FileService.getFileByKey(files, "lyricFile", false);

    let sourceUrl = existingSong.sourceUrl;
    let coverImageUrl = existingSong.coverImageUrl;
    let lyricUrl = existingSong.lyricUrl;
    let duration = existingSong.duration;

    if (sourceFile) {
      const reponse = await uploadToCloudinary(sourceFile);
      sourceUrl = reponse.secure_url;
      duration = await FileService.getAudioDuration(sourceFile);
    }
    if (coverFile) {
      const reponse = await uploadToCloudinary(coverFile);
      coverImageUrl = reponse.secure_url;
    }
    if (lyricFile) {
      const response = await uploadToCloudinary(lyricFile);
      lyricUrl = response.secure_url;
    }

    const genre = await GenreService.getGenre(song.genreId);
    const artist = await ArtistService.getArtist(song.artistId);

    await prisma.song.update({
      where: { id },
      data: {
        name: song.name,
        genreId: genre.id,
        duration,
        sourceUrl,
        coverImageUrl,
        lyricUrl,
        artistId: artist.id,
      },
    });

    const updatedSong = await this.getSong(id);

    await redis.del(this.cacheKey);
    await redis.del(`${this.cacheKey}:${id}`);
    await redis.del(`${this.cacheKey}:artist:${artist.id}`);

    await redis.set(
      `${this.cacheKey}:${updatedSong.id}`,
      JSON.stringify(updatedSong),
      "EX",
      120
    );

    return SongDTO.fromEntity(updatedSong);
  }

  async getSongLyric(id: string): Promise<Lrc> {
    const existingSong = await prisma.song.findUnique({ where: { id } });
    if (!existingSong) {
      throw new AppError(ErrorType.NOT_FOUND, "Song not exist");
    }
    const response = await fetch(existingSong.lyricUrl);
    const textResponse = await response.text();
    return Lrc.parse(textResponse);
  }

  private async isSongNameExisted(song: Song, id?: string) {
    return !!(await prisma.song.findFirst({
      where: { name: song.name, ...(id ? { id: { not: id } } : {}) },
    }));
  }
}

export default new SongService();
