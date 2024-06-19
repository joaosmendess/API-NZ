import { Router } from "express";
import {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios
} from "../controllers/depoimentoController";
import upload from "../middleware/upload";

const router = Router();

router.post("/", upload.single("file"), criarDepoimento);
router.get("/", listarDepoimentos);
router.get("/:id", obterDepoimentoPorId);
router.post("/:id/comentarios", adicionarComentario); 
router.get("/:id/comentarios", listarComentarios);

export default router;
