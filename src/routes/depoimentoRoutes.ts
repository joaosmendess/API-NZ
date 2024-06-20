import { Router } from "express";
import {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios,
  uploadFoto,
} from "../controllers/depoimentoController";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = Router();

router.post("/", upload.single("foto"), criarDepoimento);
router.get("/", listarDepoimentos);
router.get("/:id", obterDepoimentoPorId);
router.post("/:id/comentarios", adicionarComentario);
router.get("/:id/comentarios", listarComentarios);
router.post("/depoimentos/:id/foto", upload.single("foto"), uploadFoto);

export default router;
