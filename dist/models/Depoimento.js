"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Depoimento = void 0;
const mongoose_1 = require("mongoose");
const ComentarioSchema = new mongoose_1.Schema({
    nome: { type: String, required: true },
    comentario: { type: String, required: true },
    data: { type: Date, required: true, default: Date.now }
});
const DepoimentoSchema = new mongoose_1.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String },
    texto: { type: String },
    videoUrl: { type: String },
    fotoUrl: { type: String },
    comentarios: [ComentarioSchema]
});
const Depoimento = (0, mongoose_1.model)("Depoimento", DepoimentoSchema);
exports.Depoimento = Depoimento;
