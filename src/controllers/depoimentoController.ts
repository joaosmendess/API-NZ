import { Request, Response } from "express";
import { Depoimento } from "../models/Depoimento";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const listarDepoimentos = async (req: Request, res: Response) => {
  try {
    const depoimentos = await Depoimento.find();
    res.status(200).json(depoimentos);
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao listar depoimentos", details: errorMessage });
  }
};

const obterDepoimentoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const depoimento = await Depoimento.findById(id);
    if (!depoimento) {
      console.error(`Depoimento com ID ${id} não encontrado.`);
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }
    res.status(200).json(depoimento);
  } catch (error) {
    console.error(`Erro ao buscar depoimento:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao buscar depoimento", details: errorMessage });
  }
};

const criarDepoimento = async (req: Request, res: Response) => {
  try {
    const { nome, email, telefone, texto, videoUrl } = req.body;
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const novoDepoimento = new Depoimento({
      nome,
      email,
      telefone,
      texto,
      videoUrl,
      fotoUrl,
    });

    const depoimentoSalvo = await novoDepoimento.save();
    res.status(201).json(depoimentoSalvo);
  } catch (error) {
    console.error("Erro ao criar depoimento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao criar depoimento", details: errorMessage });
  }
};

const adicionarComentario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, comentario, data } = req.body;
  try {
    const depoimento = await Depoimento.findById(id);
    if (!depoimento) {
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }
    depoimento.comentarios.push({ nome, comentario, data: new Date(data) });
    await depoimento.save();
    console.log(req.body);
    res.status(200).json(depoimento);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao adicionar comentário", details: errorMessage });
  }
};

const listarComentarios = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const depoimento = await Depoimento.findById(id, "comentarios");
    if (!depoimento) {
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }
    res.status(200).json(depoimento.comentarios);
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao listar comentários", details: errorMessage });
  }
};

const uploadFoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const depoimento = await Depoimento.findById(id);
    if (!depoimento) {
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }
    if (req.file) {
      depoimento.fotoUrl = `/uploads/${req.file.filename}`;
      await depoimento.save();
      res.status(200).json(depoimento);
    } else {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao fazer upload da foto", details: errorMessage });
  }
};

export {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios,
  uploadFoto,
};
