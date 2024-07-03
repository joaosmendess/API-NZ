import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import depoimentoRoutes from "./routes/depoimentoRoutes";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nz-depoimento?authSource=admin"; // dev pae
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:0504@127.0.0.1:27017/nz-depoimento?authSource=admin"; // prod

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Mock simple authentication
const mockUsers = [
  { username: 'nucleo_zero', password: 'd3fT7g8k' },
  { username: 'admin_museu', password: 'x9Jk2lQm' }
];
const sessions: Record<string, string> = {};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token && sessions[token]) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Conexão com o MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Rota de Login
app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = mockUsers.find(user => user.username === username && user.password === password);
  if (user) {
    const token = `${Date.now()}`; // Token simples gerado com timestamp
    sessions[token] = username;
    res.cookie('token', token, { httpOnly: true }).json({ token });
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

// Rota de Logout
app.post('/logout', (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (token) {
    delete sessions[token];
  }
  res.clearCookie('token');
  res.redirect('/login');
});

// Rotas abertas
app.use("/depoimentos", depoimentoRoutes);

// Proteger a rota raiz ("/")
app.get('/', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir o arquivo index.html e outros arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
