import express from "express";
import { upload, uploadToCloudinary } from "@src/configs/CloudinaryConfig";
import artistRoute from "@src/routes/ArtistRoute";
import songRoute from "@src/routes/SongRoute";
import genreRoute from "@src/routes/GenreRoute";

const router = express.Router();

// Example route
router.get("/", (req, res, next) => {
  res.send("Working Ok 🐧🐧🐧");
});
router.post("/upload", upload.single("file"), async (req, res, next) => {
  const response = await uploadToCloudinary(req.file!).catch((e) => next(e));
  res.status(200).json(response);
});

router.use("/genre", genreRoute);
router.use("/artist", artistRoute);
router.use("/song", songRoute);

export default router;
