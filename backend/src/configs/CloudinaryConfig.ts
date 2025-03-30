import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";
import { config } from "@src/configs/AppConfig";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: "Uploads",
        public_id: `${Date.now()}-${uuidv4()}`,
        resource_type: "auto"
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export { upload, uploadToCloudinary };
