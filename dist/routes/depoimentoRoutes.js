"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const depoimentoController_1 = require("../controllers/depoimentoController");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/", upload_1.default.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), depoimentoController_1.criarDepoimento);
router.get('/', depoimentoController_1.listarDepoimentos);
router.get('/:id', depoimentoController_1.obterDepoimentoPorId);
router.post('/:id/comentarios', depoimentoController_1.adicionarComentario);
router.get('/:id/comentarios', depoimentoController_1.listarComentarios);
router.delete('/:id/comentarios/:comentarioId', depoimentoController_1.deletarComentario);
router.delete('/:id', depoimentoController_1.deletarDepoimento);
exports.default = router;
