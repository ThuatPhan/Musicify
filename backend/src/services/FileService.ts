import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";
ffmpeg.setFfmpegPath(ffmpegStatic as string);

class FileService {
  static getFileByKey(
    files:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | undefined,
    key: string,
    required: boolean = true
  ): Express.Multer.File | undefined {
    if (!files) {
      if (required)
        throw new AppError(ErrorType.BAD_REQUEST, "No files uploaded");
      return undefined;
    }

    const uploadedFiles = files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const file = uploadedFiles[key]?.[0];

    if (!file && required) {
      throw new AppError(ErrorType.BAD_REQUEST, `${key} file is required`);
    }

    return file;
  }

  static async getAudioDuration(file: Express.Multer.File): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(file.path, (err, metadata) => {
        if (err) reject(err);
        else resolve(Math.round(metadata.format.duration || 0));
      });
    });
  }
}

export default FileService;
