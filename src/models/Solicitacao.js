const mongoose = require('mongoose');

const SolicitacaoSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  opcoes: {
    transporte: { type: String, required: true },
    dataEntrega: { type: Date, required: true }
  },
  destinatario: {
    nome: { type: String, required: true },
    email: { type: String, required: true }
  },
  validade: { type: Date, required: true },
  status: { type: String, default: 'pendente' },
  tokenConfirmacao: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Solicitacao', SolicitacaoSchema);
