import { Router } from "express";
import {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
} from "../controllers/depoimentoController";
import upload from "../middleware/upload";

const router = Router();

router.post("/", upload.single("file"), criarDepoimento);
router.get("/", listarDepoimentos);
router.get("/:id", obterDepoimentoPorId); // Adicione esta linha

export default router;
