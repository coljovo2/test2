const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

let conn = null;
async function connect() {
  if (conn == null) {
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
    return res.status(405).send('Method Not Allowed');
  }

  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email, senha });
    if (!usuario) {
      return res.status(401).send('Credenciais inválidas');
    }

    return res.status(200).send('Login bem-sucedido');
  } catch (error) {
    return res.status(500).send('Erro ao fazer login');
  }
};
