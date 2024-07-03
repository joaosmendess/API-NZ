"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const depoimentoRoutes_1 = __importDefault(require("./routes/depoimentoRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nz-depoimento?authSource=admin"; // dev pae
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:0504@127.0.0.1:27017/nz-depoimento?authSource=admin"; // prod
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Mock simple authentication
const mockUsers = [
    { username: 'nucleo_zero', password: 'd3fT7g8k' },
    { username: 'admin_museu', password: 'x9Jk2lQm' }
];
const sessions = {};
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (token && sessions[token]) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
// Conexão com o MongoDB
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error("Erro ao conectar no MongoDB:", err));
// Rota de Login
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'login.html'));
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = mockUsers.find(user => user.username === username && user.password === password);
    if (user) {
        const token = `${Date.now()}`; // Token simples gerado com timestamp
        sessions[token] = username;
        res.cookie('token', token, { httpOnly: true }).json({ token });
    }
    else {
        res.status(401).json({ message: "Credenciais inválidas" });
    }
});
// Rota de Logout
app.post('/logout', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        delete sessions[token];
    }
    res.clearCookie('token');
    res.redirect('/login');
});
// Rotas abertas
app.use("/depoimentos", depoimentoRoutes_1.default);
// Proteger a rota raiz ("/")
app.get('/', authMiddleware, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Servir o arquivo index.html e outros arquivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
