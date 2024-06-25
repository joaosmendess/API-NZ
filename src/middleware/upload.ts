import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Configuração do armazenamento para fotos e vídeos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      cb(null, path.resolve(__dirname, "../uploads/photos/"));
    } else {
      cb(null, path.resolve(__dirname, "../uploads/videos/"));
    }
  },
  
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro de arquivos para fotos e vídeos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ext === ".mp4" ||
    ext === ".mov" ||
    ext === ".avi" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Apenas arquivos de vídeo e foto são permitidos") as any,
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
