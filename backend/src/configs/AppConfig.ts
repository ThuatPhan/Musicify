import dotenv from "dotenv";
dotenv.config();

export const config = {
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE!,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN!,
  AUTH0_ADMIN_PERMISSION: process.env.AUTH0_ADMIN_PERMISSION!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  REDIS_HOST:process.env.REDIS_HOST!,
  REDIS_PORT:process.env.REDIS_PORT!
};
