import { Schema, model, Document, Types } from "mongoose";

interface IComentario extends Document {
  _id: Types.ObjectId;
  nome: string;
  comentario: string;
  data: Date;
}

interface IDepoimento extends Document {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  telefone: string;
  texto?: string;
  videoUrl?: string;
  fotoUrl?: string;
  videoDuration?: number;
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
  videoDuration: { type: Number }, 
  comentarios: [ComentarioSchema]
});

const Depoimento = model<IDepoimento>("Depoimento", DepoimentoSchema);

export { Depoimento, IDepoimento, IComentario };
