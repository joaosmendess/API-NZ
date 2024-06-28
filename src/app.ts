import express from "express";
import mongoose from "mongoose";
import depoimentoRoutes from "./routes/depoimentoRoutes";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3001;
// const MONGODB_URI =
//   process.env.MONGODB_URI ||
//   "mongodb://127.0.0.1:27017/nz-depoimento?authSource=admin"; // local gustavo

  const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://avoguga:0504@127.0.0.1:27017/nz-depoimento?authSource=admin";

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Rotas
app.use("/depoimentos", depoimentoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
