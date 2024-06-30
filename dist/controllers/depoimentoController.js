"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarComentario = exports.deletarDepoimento = exports.listarComentarios = exports.adicionarComentario = exports.obterDepoimentoPorId = exports.listarDepoimentos = exports.criarDepoimento = void 0;
const Depoimento_1 = require("../models/Depoimento");
const fs_1 = __importDefault(require("fs"));
const toPublicUrl = (localPath) => {
    if (!localPath)
        return null;
    const baseUrl = "https://gestormuseu.serradabarriga.app.br"; // Rota de prod, tenho que arrumar ela ainda.
    // const baseUrl = "http://localhost:3001"; // Adicione um fallback
    const adjustedPath = localPath.replace(/^.*\/uploads\//, 'uploads/');
    return `${baseUrl}/${adjustedPath}`;
};
const listarDepoimentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let depoimentos = yield Depoimento_1.Depoimento.find().select("id nome texto videoUrl fotoUrl");
        depoimentos = depoimentos.map(depoimento => {
            const depoimentoObj = depoimento.toObject();
            return Object.assign(Object.assign({}, depoimentoObj), { fotoUrl: toPublicUrl(depoimentoObj.fotoUrl), videoUrl: toPublicUrl(depoimentoObj.videoUrl) });
        });
        res.status(200).json(depoimentos);
    }
    catch (error) {
        console.error("Erro ao listar depoimentos:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res.status(500).json({ error: "Erro ao listar depoimentos", details: errorMessage });
    }
});
exports.listarDepoimentos = listarDepoimentos;
const obterDepoimentoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const depoimento = yield Depoimento_1.Depoimento.findById(id);
        if (!depoimento) {
            console.error(`Depoimento com ID ${id} não encontrado.`);
            return res.status(404).json({ error: "Depoimento não encontrado" });
        }
        const depoimentoPublic = Object.assign(Object.assign({}, depoimento.toObject()), { fotoUrl: toPublicUrl(depoimento.fotoUrl), videoUrl: toPublicUrl(depoimento.videoUrl) });
        res.status(200).json(depoimentoPublic);
    }
    catch (error) {
        console.error(`Erro ao buscar depoimento:`, error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res.status(500).json({ error: "Erro ao buscar depoimento", details: errorMessage });
    }
});
exports.obterDepoimentoPorId = obterDepoimentoPorId;
const criarDepoimento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, telefone, texto } = req.body;
        let fotoUrl = null;
        let videoUrl = null;
        if (req.files && typeof req.files === "object" && "foto" in req.files) {
            fotoUrl = req.files["foto"][0].path;
        }
        if (req.files && typeof req.files === "object" && "video" in req.files) {
            videoUrl = req.files["video"][0].path;
        }
        if (fotoUrl === null && videoUrl === null) {
            return res
                .status(400)
                .json({ error: "Depoimento deve conter ao menos uma foto ou vídeo" });
        }
        const novoDepoimento = new Depoimento_1.Depoimento({
            nome,
            email,
            telefone,
            texto,
            fotoUrl,
            videoUrl,
        });
        const depoimentoSalvo = yield novoDepoimento.save();
        res.status(201).json(depoimentoSalvo);
    }
    catch (error) {
        console.error("Erro ao criar depoimento:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res
            .status(500)
            .json({ error: "Erro ao criar depoimento", details: errorMessage });
    }
});
exports.criarDepoimento = criarDepoimento;
const adicionarComentario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nome, comentario, data } = req.body;
    try {
        const depoimento = yield Depoimento_1.Depoimento.findById(id);
        if (!depoimento) {
            return res.status(404).json({ error: "Depoimento não encontrado" });
        }
        const novoComentario = {
            nome,
            comentario,
            data: new Date(data),
        };
        depoimento.comentarios.push(novoComentario);
        yield depoimento.save();
        res.status(200).json(depoimento);
    }
    catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res
            .status(500)
            .json({ error: "Erro ao adicionar comentário", details: errorMessage });
    }
});
exports.adicionarComentario = adicionarComentario;
const listarComentarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const depoimento = yield Depoimento_1.Depoimento.findById(id, "comentarios");
        if (!depoimento) {
            return res.status(404).json({ error: "Depoimento não encontrado" });
        }
        res.status(200).json(depoimento.comentarios);
    }
    catch (error) {
        console.error("Erro ao listar comentários:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res
            .status(500)
            .json({ error: "Erro ao listar comentários", details: errorMessage });
    }
});
exports.listarComentarios = listarComentarios;
const deletarDepoimento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const depoimento = yield Depoimento_1.Depoimento.findByIdAndDelete(id);
        if (!depoimento) {
            return res.status(404).json({ error: "Depoimento não encontrado" });
        }
        // Deletar arquivos associados
        if (depoimento.fotoUrl) {
            fs_1.default.unlink(depoimento.fotoUrl, (err) => {
                if (err)
                    console.error(`Erro ao deletar arquivo de foto: ${err.message}`);
            });
        }
        if (depoimento.videoUrl) {
            fs_1.default.unlink(depoimento.videoUrl, (err) => {
                if (err)
                    console.error(`Erro ao deletar arquivo de vídeo: ${err.message}`);
            });
        }
        res.status(200).json({ message: "Depoimento deletado com sucesso" });
    }
    catch (error) {
        console.error("Erro ao deletar depoimento:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res
            .status(500)
            .json({ error: "Erro ao deletar depoimento", details: errorMessage });
    }
});
exports.deletarDepoimento = deletarDepoimento;
const deletarComentario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, comentarioId } = req.params;
    try {
        const depoimento = yield Depoimento_1.Depoimento.findById(id);
        if (!depoimento) {
            return res.status(404).json({ error: "Depoimento não encontrado" });
        }
        const comentarioIndex = depoimento.comentarios.findIndex((comentario) => comentario._id.toString() === comentarioId);
        if (comentarioIndex === -1) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }
        depoimento.comentarios.splice(comentarioIndex, 1);
        yield depoimento.save();
        res.status(200).json({ message: "Comentário deletado com sucesso" });
    }
    catch (error) {
        console.error("Erro ao deletar comentário:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        res
            .status(500)
            .json({ error: "Erro ao deletar comentário", details: errorMessage });
    }
});
exports.deletarComentario = deletarComentario;
