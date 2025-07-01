const mongoose = require('mongoose');
const User = require('../models/user');
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

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  try {
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).send('Email já cadastrado');
    }

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    return res.status(200).send('Usuário registrado com sucesso');
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return res.status(500).send('Erro interno ao registrar');
  }
};
