import { Request, Response, NextFunction } from "express";
import genreService from "@src/services/GenreService";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "@src/dtos/ApiResponse";

class GenreController {
  async createGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const genre = await genreService.createGenre(req.body);
      res.status(StatusCodes.CREATED).json(ApiResponse.success(genre));
    } catch (error) {
      next(error);
    }
  }
  async getGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const genreId = req.params.id;
      const genre = await genreService.getGenre(genreId);
      res.status(StatusCodes.OK).json(ApiResponse.success(genre));
    } catch (error) {
      next(error);
    }
  }
  async getGenres(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await genreService.getGenres();
      res.status(StatusCodes.OK).json(ApiResponse.success(genres));
    } catch (error) {
      next(error);
    }
  }
  async updateGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const genreId = req.params.id;
      const updatedGenre = await genreService.updateGenre(genreId, req.body);
      res.status(StatusCodes.OK).json(ApiResponse.success(updatedGenre));
    } catch (error) {
      next(error);
    }
  }
  async deleteGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const genreId = req.params.id;
      await genreService.deleteGenre(genreId);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new GenreController();
