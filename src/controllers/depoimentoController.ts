import { Request, Response } from "express";
import { Depoimento, IDepoimento } from "../models/Depoimento";

const toPublicUrl = (localPath: any) => {
  if (!localPath) return null;
  // Garantir que não haja 'undefined' no início da URL
  const baseUrl = "http://localhost:3001"; // Adicione um fallback
  // const baseUrl = process.env.BASE_URL || "http://localhost:3001"; 
  const adjustedPath = localPath.replace(/^.*\/uploads\//, 'uploads/');
  return `${baseUrl}/${adjustedPath}`;
};



const listarDepoimentos = async (req: Request, res: Response) => {
  try {
    let depoimentos = await Depoimento.find().select("id nome texto videoUrl fotoUrl");
    depoimentos = depoimentos.map(depoimento => {
      const depoimentoObj = depoimento.toObject();
      return {
        ...depoimentoObj,
        fotoUrl: toPublicUrl(depoimentoObj.fotoUrl),
        videoUrl: toPublicUrl(depoimentoObj.videoUrl),
      } as IDepoimento; 
    });
    res.status(200).json(depoimentos);
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
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
    console.log(req.body);
    const { nome, email, telefone, texto } = req.body;
    let fotoUrl = null;
    let videoUrl = null;

    if (req.files && typeof req.files === "object" && "foto" in req.files) {
      fotoUrl = req.files["foto"][0].path;
    }
    if (req.files && typeof req.files === "object" && "video" in req.files) {
      videoUrl = req.files["video"][0].path;
      console.log(videoUrl);
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
    console.log("Depoimento salvo:", depoimentoSalvo);
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

export {
  criarDepoimento,
  listarDepoimentos,
  obterDepoimentoPorId,
  adicionarComentario,
  listarComentarios,
};
