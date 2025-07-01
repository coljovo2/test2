const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Modelos
const User = require('./meu-projeto/src/models/user');

// Força o carregamento do .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verifica se a URI do MongoDB está presente
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI não está definida no arquivo .env');
  process.exit(1);
}

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// 🟢 Redireciona a rota raiz para a página de login
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// ======== ROTAS DE REGISTRO E LOGIN ========

// Registro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).send('Email já cadastrado');
    }

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    res.status(200).send('Usuário registrado com sucesso');
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).send('Erro ao registrar');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email, senha });
    if (!usuario) {
      return res.status(401).send('Credenciais inválidas');
    }

    res.status(200).send('Login bem-sucedido');
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).send('Erro ao fazer login');
  }
});

