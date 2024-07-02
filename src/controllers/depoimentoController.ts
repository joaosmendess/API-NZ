import { Request, Response } from "express";
import { Depoimento, IComentario, IDepoimento } from "../models/Depoimento";
import fs from "fs";
import path from "path";

const toPublicUrl = (localPath: any) => {
  if (!localPath) return null;
    const baseUrl = "https://gestormuseu.serradabarriga.app.br"; // Rota de prod, tenho que arrumar ela ainda.
  // const baseUrl = "http://localhost:3001"; // Adicione um fallback
  const adjustedPath = localPath.replace(/^.*\/uploads\//, 'uploads/');
  return `${baseUrl}/${adjustedPath}`;
};


const listarDepoimentos = async (req: Request, res: Response) => {
  try {
    const depoimentos = await Depoimento.find().select("nome email telefone texto videoUrl fotoUrl").exec();
    const depoimentosPublic = depoimentos.map(depoimento => ({
      ...depoimento.toObject(),
      fotoUrl: toPublicUrl(depoimento.fotoUrl),
      videoUrl: toPublicUrl(depoimento.videoUrl),
    }));
    res.status(200).json(depoimentosPublic);
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    res.status(500).json({ error: "Erro ao listar depoimentos", details: errorMessage });
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
    const depoimentoPublic = {
      ...depoimento.toObject(),
      fotoUrl: toPublicUrl(depoimento.fotoUrl),
      videoUrl: toPublicUrl(depoimento.videoUrl),
    };
    res.status(200).json(depoimentoPublic);
  } catch (error) {
    console.error(`Erro ao buscar depoimento:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res.status(500).json({ error: "Erro ao buscar depoimento", details: errorMessage });
  }
};

const criarDepoimento = async (req: Request, res: Response) => {
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

    const novoDepoimento = new Depoimento({
      nome,
      email,
      telefone,
      texto,
      fotoUrl,
      videoUrl,
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

    const novoComentario: IComentario = {
      nome,
      comentario,
      data: new Date(data),
    } as IComentario;

    depoimento.comentarios.push(novoComentario);
    await depoimento.save();
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

const deletarDepoimento = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const depoimento = await Depoimento.findByIdAndDelete(id);
    if (!depoimento) {
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }

    // Deletar arquivos associados
    if (depoimento.fotoUrl) {
      fs.unlink(depoimento.fotoUrl, (err) => {
        if (err) console.error(`Erro ao deletar arquivo de foto: ${err.message}`);
      });
    }
    if (depoimento.videoUrl) {
      fs.unlink(depoimento.videoUrl, (err) => {
        if (err) console.error(`Erro ao deletar arquivo de vídeo: ${err.message}`);
      });
    }

    res.status(200).json({ message: "Depoimento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar depoimento:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao deletar depoimento", details: errorMessage });
  }
};

const deletarComentario = async (req: Request, res: Response) => {
  const { id, comentarioId } = req.params;
  try {
    const depoimento = await Depoimento.findById(id);
    if (!depoimento) {
      return res.status(404).json({ error: "Depoimento não encontrado" });
    }

    const comentarioIndex = depoimento.comentarios.findIndex(
      (comentario: IComentario) => comentario._id.toString() === comentarioId
    );
    if (comentarioIndex === -1) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    depoimento.comentarios.splice(comentarioIndex, 1);
    await depoimento.save();
    res.status(200).json({ message: "Comentário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    res
      .status(500)
      .json({ error: "Erro ao deletar comentário", details: errorMessage });
  }
};

export {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios,
  deletarDepoimento,
  deletarComentario
};
