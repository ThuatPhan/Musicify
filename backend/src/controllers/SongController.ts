import ApiResponse from "@src/dtos/ApiResponse";
import SongService from "@src/services/SongService";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

class SongController {
  async createSong(req: Request, res: Response, next: NextFunction) {
    try {
      const newSong = await SongService.createSong(req.body, req.files);
      res.status(StatusCodes.CREATED).json(ApiResponse.success(newSong));
    } catch (error) {
      next(error);
    }
  }

  async getSong(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const song = await SongService.getSong(id);
      res.status(StatusCodes.OK).json(ApiResponse.success(song));
    } catch (error) {
      next(error);
    }
  }

  async getSongs(req: Request, res: Response, next: NextFunction) {
    try {
      const songs = await SongService.getSongs();
      res.status(StatusCodes.OK).json(ApiResponse.success(songs));
    } catch (error) {
      next(error);
    }
  }

  async getSongOfArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const songs = await SongService.getSongsByArtist(id);
      res.status(StatusCodes.OK).json(ApiResponse.success(songs));
    } catch (error) {
      next(error);
    }
  }

  async updateSong(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedSong = await SongService.updateSong(id, req.body, req.files);
      res.status(StatusCodes.OK).json(ApiResponse.success(updatedSong));
    } catch (error) {
      next(error);
    }
  }

  async getSongLyric(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lyric = await SongService.getSongLyric(id);
      res.status(StatusCodes.OK).json(ApiResponse.success(lyric));
    } catch (error) {
      next(error);
    }
  }
}

export default new SongController();
