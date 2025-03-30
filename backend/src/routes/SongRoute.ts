import express from "express";
import {
  checkAccessToken,
  checkPermission,
} from "@src/middlewares/VerifyToken";
import { validateData } from "@src/middlewares/ValidateSchema";
import songSchema from "@src/schemas/SongSchema";
import { upload } from "@src/configs/CloudinaryConfig";
import SongController from "@src/controllers/SongController";
import { config } from "@src/configs/AppConfig";

const songRoute = express.Router();
songRoute.post(
  "/",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  upload.fields([
    { name: "source", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "lyricFile", maxCount: 1 },
  ]),
  validateData(songSchema),
  SongController.createSong
);
songRoute.get("/:id", SongController.getSong);
songRoute.get("/", SongController.getSongs);
songRoute.get("/artist/:id", SongController.getSongOfArtist);
songRoute.put(
  "/:id",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  upload.fields([
    { name: "source", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "lyricFile", maxCount: 1 },
  ]),
  validateData(songSchema),
  SongController.updateSong
);
songRoute.get("/lyric/:id", SongController.getSongLyric);

export default songRoute;
