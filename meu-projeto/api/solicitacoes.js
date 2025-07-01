const mongoose = require('mongoose');
const Solicitacao = require('../models/Solicitacao');
require('dotenv').config();

let conn = null;
async function connect() {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return conn;
}

module.exports = async (req, res) => {
  await connect();

  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const { descricao, opcoes = {}, destinatario = {}, validade } = req.body;

  if (!descricao || !opcoes.transporte || !opcoes.dataEntrega || !destinatario.nome || !destinatario.email || !validade) {
    return res.status(400).send('Preencha todos os campos corretamente');
  }

  try {
    const novaSolicitacao = new Solicitacao({
      descricao,
      opcoes,
      destinatario,
      validade,
    });

    await novaSolicitacao.save();

    return res.status(200).send('Solicitação registrada com sucesso');
  } catch (error) {
    console.error('Erro ao salvar solicitação:', error);
    return res.status(500).send('Erro ao salvar solicitação');
  }
};
