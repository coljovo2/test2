const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // Mailtrap não usa SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarEmail(destinatarioEmail, token) {
  const link = `http://localhost:3000/confirmar/${token}`;

  const info = await transporter.sendMail({
    from: `"Sistema de Solicitações" <${process.env.EMAIL_USER}>`,
    to: destinatarioEmail,
    subject: 'Confirmação de Solicitação',
    html: `
      <p>Você recebeu uma nova solicitação.</p>
      <p><a href="${link}">Clique aqui para confirmar</a></p>
    `
  });

  console.log(`📧 Email enviado para ${destinatarioEmail}`);
  console.log(`📨 Mailtrap ID: ${info.messageId}`);
}

module.exports = { enviarEmail };
