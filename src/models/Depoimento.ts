import { Schema, model, Document } from "mongoose";

interface IDepoimento extends Document {
  nome: string;
  email: string;
  telefone: string;
  texto?: string;
  videoUrl?: string;
  fotoUrl?: string;
}

const DepoimentoSchema = new Schema<IDepoimento>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  texto: { type: String },
  videoUrl: { type: String },
  fotoUrl: { type: String },
});

const Depoimento = model<IDepoimento>("Depoimento", DepoimentoSchema);

export { Depoimento, IDepoimento };
