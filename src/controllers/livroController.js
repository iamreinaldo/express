import { autor, livro } from "../models/index.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class LivroController {

  
    
  static async listarLivros (req, res, next) {
    try{  
      const buscaLivros = livro.find();

      req.resultado = buscaLivros;

      next();

    } catch (erro){
      next(erro);
    }
  }

  static async listarLivroPorId (req, res, next) {
    try{
      const id = req.params.id;
      const livroEncontrado = await livro.findById(id);
      if(livroEncontrado !== null){
        res.status(200).json(livroEncontrado);
      } else {
        next(new NaoEncontrado("Livro não encontrado"));
      }
    } catch (erro){
      next(erro);
    }
  }

  static async cadastrarLivro (req, res, next) {
    const novoLivro = req.body;
    try {
      const autorEncontrato = await autor.findById(novoLivro.autor);
      const livroCompleto = {...novoLivro, autor: {...autorEncontrato._doc}};
      const livroCriado = await livro.create(livroCompleto);
      res.status(201).json({ message: "criado com sucesso", livro: livroCriado });
    }   catch(erro) {
      next(erro);
    }
  }

  static async atualizarLivro (req, res, next) {
    try{
      const id = req.params.id;
      const livroEncontrado = await livro.findById(id);
      if(livroEncontrado !== null){
        await livro.findByIdAndUpdate(id, req.body);
        res.status(200).json({message: "livro atualizado"});
      } else {
        next(new NaoEncontrado("Livro não encontrado"));
      }
    } catch (erro){
      next(erro);
    }
  }

  static async deletarLivro (req, res, next) {
    try{
      const id = req.params.id;
      const livroEncontrado = await livro.findById(id);
      if(livroEncontrado !== null){
        await livro.findByIdAndDelete(id);
        res.status(200).json({message: "livro deletado"});
      } else {
        next(new NaoEncontrado("Livro não encontrado!"));
      }
    } catch (erro){
      next(erro);
    }
  }

  static async listarLivrosPorFiltro (req, res, next) {        
    try{
      const busca = await processaBusca(req.query);

      if(busca!==null){
        const livrosResultado = livro
          .find(busca)
          .populate("autor");

        req.resultado = livrosResultado;
          
        res.status(200).json(livrosResultado);
      } else {
        res.status(200).send([]);
      }

    } catch(erro){
      next(erro);
    }
  }
}

async function  processaBusca(parametros){
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor} = parametros;

  const regex = new RegExp(titulo, "i");

  let busca = {};

  if(editora) busca.editora = regex;
  if(titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if(minPaginas || maxPaginas) busca.paginas = {};

  //gte = Greater then or Equal
  if(minPaginas) busca.paginas.$gte = minPaginas;
  //lte = Less then or Equal
  if(maxPaginas) busca.paginas.$lte = maxPaginas;

  if(nomeAutor){
    const autor = await autor.findOne({nome: nomeAutor});

    if (autor !== null) {      
      busca.autor = autor._id;
    } else {
      busca = null;
    }

  }

  return busca;
}


export default LivroController;



