import express from "express";
import {
  checkAccessToken,
  checkPermission,
} from "@src/middlewares/VerifyToken";
import { validateData } from "@src/middlewares/ValidateSchema";
import genreSchema from "@src/schemas/GenreSchema";
import GenreController from "@src/controllers/GenreController";
import { config } from "@src/configs/AppConfig";

export const genreRoute = express.Router();
genreRoute.post(
  "/",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  validateData(genreSchema),
  GenreController.createGenre
);
genreRoute.get("/:id", GenreController.getGenre);
genreRoute.get("/", GenreController.getGenres);
genreRoute.put(
  "/:id",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  validateData(genreSchema),
  GenreController.updateGenre
);
genreRoute.delete("/:id", GenreController.deleteGenre);

export default genreRoute;
