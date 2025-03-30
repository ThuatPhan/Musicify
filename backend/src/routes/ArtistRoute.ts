import express from "express";
import {
  checkAccessToken,
  checkPermission,
} from "@src/middlewares/VerifyToken";
import { validateData } from "@src/middlewares/ValidateSchema";
import { artistSchema } from "@src/schemas/ArtistSchema";
import { upload } from "@src/configs/CloudinaryConfig";
import ArtistController from "@src/controllers/ArtistController";
import { config } from "@src/configs/AppConfig";

const artistRoute = express.Router();

artistRoute.post(
  "/",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  upload.single("avatarFile"),
  validateData(artistSchema),
  ArtistController.createArtist
);
artistRoute.get("/:id", ArtistController.getArtist);
artistRoute.get("/", ArtistController.getArtists);
artistRoute.put(
  "/:id",
  checkAccessToken,
  checkPermission(config.AUTH0_ADMIN_PERMISSION),
  upload.single("avatarFile"),
  validateData(artistSchema),
  ArtistController.updateArtist
);

export default artistRoute;
