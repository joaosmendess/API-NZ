"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuração do armazenamento para fotos e vídeos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
            cb(null, path_1.default.resolve(__dirname, "../uploads/photos/"));
        }
        else {
            cb(null, path_1.default.resolve(__dirname, "../uploads/videos/"));
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// Filtro de arquivos para fotos e vídeos
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (ext === ".mp4" ||
        ext === ".mov" ||
        ext === ".avi" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".png") {
        cb(null, true);
    }
    else {
        cb(new Error("Apenas arquivos de vídeo e foto são permitidos"), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
