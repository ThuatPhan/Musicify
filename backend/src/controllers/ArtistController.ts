import ApiResponse from "@src/dtos/ApiResponse";
import ArtistService from "@src/services/ArtistService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ArtistController {
  async createArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const artistData = req.body;
      const avatarFile = req.file;
      const artist = await ArtistService.createArtist(artistData, avatarFile);
      res.status(StatusCodes.CREATED).json(ApiResponse.success(artist));
    } catch (error) {
      next(error);
    }
  }

  async getArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const artists = await ArtistService.getArtists();
      res.status(StatusCodes.OK).json(ApiResponse.success(artists));
    } catch (error) {
      next(error);
    }
  }

  async getArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const artist = await ArtistService.getArtist(id);
      res.status(StatusCodes.OK).json(ApiResponse.success(artist));
    } catch (error) {
      next(error);
    }
  }

  async updateArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedArtist = await ArtistService.updateArtist(
        id,
        req.body,
        req.file
      );
      res.status(StatusCodes.OK).json(ApiResponse.success(updatedArtist));
    } catch (error) {
      next(error);
    }
  }
}

export default new ArtistController();
