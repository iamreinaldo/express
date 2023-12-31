import NaoEncontrado from "../erros/NaoEncontrado.js";
import {autor} from "../models/index.js";

class AutorController {
    
  static listarAutores (req, res, next) {
    try{
      const autoresResultado =  autor.find({});
      req.resultado = autoresResultado;
      next();
    } catch (erro){
      next(erro);
    }
  }

  static async listarAutorPorId (req, res, next) {
    try{
      const id = req.params.id;
      const autorEncontrado = await autor.findById(id);

      if (autorEncontrado !== null) {
        res.status(200).json(autorEncontrado);
      } else{
        next(new NaoEncontrado("Id do autor não localizado"));
      }

    } catch (erro){
      next(erro);
    }
  }

  static async cadastrarAutor (req, res, next) {
    try {
      const novoAutor = await autor.create(req.body);
      res.status(201).json({ message: "criado com sucesso", autor: novoAutor });
    }   catch(erro) {
      next(erro);
    }
  }

  static async atualizarAutor (req, res, next) {
    try{
      const id = req.params.id;
      const autorResultado = await autor.findById(id);

      if(autorResultado !== null) {
        await autor.findByIdAndUpdate(id, req.body);
        res.status(200).json({message: "autor atualizado"});
      } else {
        next(new NaoEncontrado("Id do autor não localizado"));
      }
    } catch (erro){
      next(erro);
    }
  }

  static async deletarAutor (req, res, next) {
    try{
      const id = req.params.id;
      const autorResultado = await autor.findById(id);

      if(autorResultado !== null){
        await autor.findByIdAndDelete(id);
        res.status(200).json({message: "autor deletado"});
      } else {
        next(new NaoEncontrado("Id do autor não localizado"));
      }
    } catch (erro){
      next(erro);
    }
  }
}

export default AutorController;