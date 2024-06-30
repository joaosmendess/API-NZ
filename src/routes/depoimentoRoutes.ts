import express from 'express';
import {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios,
  deletarDepoimento,
  deletarComentario
} from '../controllers/depoimentoController';
import upload from '../middleware/upload';

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  criarDepoimento
);
router.get('/', listarDepoimentos);
router.get('/:id', obterDepoimentoPorId);
router.post('/:id/comentarios', adicionarComentario);
router.get('/:id/comentarios', listarComentarios);
router.delete('/:id/comentarios/:comentarioId', deletarComentario); 
router.delete('/:id', deletarDepoimento);

export default router;
