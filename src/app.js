import express from "express";
import conectaNaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manilupadorDeErros.js";

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
  console.error("erro de conexão", erro);
});

conexao.once("open", ()=>{
  console.log("conexão com scuesso");
});

const app = express();
routes(app);

app.use(manipuladorDeErros);

export default app;