/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import ErroBase from "../erros/ErroBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import ErroValidacao from "../erros/ErroValidacao.js";

export default function manipuladorDeErros(erro,req,res,next) {
  if(erro instanceof mongoose.Error.CastError) {
    new RequisicaoIncorreta().enviarResposta(res);
  }else if(erro instanceof mongoose.Error.ValidationError){
    new ErroValidacao(erro).enviarResposta(res);
  } else {
    new ErroBase().enviarResposta(res);
  }
}