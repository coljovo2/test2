const express = require('express');
const router = express.Router();
const Solicitacao = require('../models/Solicitacao');
const { enviarEmail } = require('../utils/mailer');
const crypto = require('crypto');

router.post('/', async (req, res) => {
  try {
    console.log('🟢 Dados recebidos do formulário:', req.body);

    const token = crypto.randomBytes(16).toString('hex');

    const nova = new Solicitacao({
      ...req.body,
      tokenConfirmacao: token
    });

    const resultado = await nova.save();
    console.log('📦 Documento salvo no MongoDB:', resultado);

    const destino = req.body.destinatario?.email || 'SEM EMAIL';
    console.log('📨 Enviando e-mail para:', destino);

    await enviarEmail(destino, token);

    res.status(201).send('Solicitação enviada com sucesso!');
  } catch (err) {
    console.error('❌ ERRO COMPLETO:', err);
    res.status(500).send(`Erro ao enviar solicitação: ${err.message}`);
  }
});

// Rota de confirmação de solicitação por token
router.get('/confirmar/:token', async (req, res) => {
  try {
    const token = req.params.token;

    const solicitacao = await Solicitacao.findOne({ tokenConfirmacao: token });

    if (!solicitacao) {
      return res.status(404).send('<h2>Solicitação não encontrada ou link inválido.</h2>');
    }

    if (solicitacao.status !== 'pendente') {
      return res.send('<h2>Esta solicitação já foi confirmada ou respondida.</h2>');
    }

    solicitacao.status = 'confirmado';
    await solicitacao.save();

    res.send('<h2>Solicitação confirmada com sucesso!</h2>');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Erro ao confirmar solicitação.</h2>');
  }
});

router.get('/teste', (req, res) => {
  res.send('API funcionando!');
});

module.exports = router;
