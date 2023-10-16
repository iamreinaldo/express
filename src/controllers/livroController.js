import livro from "../models/Livro.js";
import { autor } from "../models/Autor.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class LivroController {
    
  static async listarLivros (req, res, next) {
    try{  
      const listaLivros = await livro.find({});
      res.status(200).json(listaLivros);
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

  static async listarLivrosPorEditora (req, res, next) {
    const editora = req.query.editora;
        
    try{
      const livrosPorEditora = await livro.find({editora: editora});
      res.status(200).json(livrosPorEditora);
    } catch(erro){
      next(erro);
    }
  }
}


export default LivroController;



