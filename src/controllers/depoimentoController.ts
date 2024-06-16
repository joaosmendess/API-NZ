import { Request, Response } from "express";
import { Depoimento } from "../models/Depoimento";

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
    const { id } = req.params; // Correção: Desestruture 'id' corretamente
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
    const { nome, email, telefone, texto, videoUrl, fotoUrl } = req.body;
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

export { criarDepoimento, listarDepoimentos, obterDepoimentoPorId };
