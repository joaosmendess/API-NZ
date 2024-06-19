import { Schema, model, Document } from "mongoose";
interface IComentario {
  nome: string;
  comentario: string;
  data: Date;
}

interface IDepoimento extends Document {
  nome: string;
  email: string;
  telefone: string;
  texto?: string;
  videoUrl?: string;
  fotoUrl?: string;
  comentarios: IComentario[];
}

const ComentarioSchema = new Schema<IComentario>({
  nome: { type: String, required: true },
  comentario: { type: String, required: true },
  data: { type: Date, required: true, default: Date.now }
});

const DepoimentoSchema = new Schema<IDepoimento>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  texto: { type: String },
  videoUrl: { type: String },
  fotoUrl: { type: String },
  comentarios: [ComentarioSchema]
});

const Depoimento = model<IDepoimento>("Depoimento", DepoimentoSchema);

export { Depoimento, IDepoimento, IComentario };
