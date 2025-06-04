const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nodecorreos@gmail.com',
        pass: 'hwko pkzx fkqv cjpq',
    }
});

const sendConfirmEmail = (emailUser) => {
    const htmlContent = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #4CAF50;">¡Cuenta creada con éxito!</h2>
      <p>Gracias por registrarte. Tu cuenta se ha creado correctamente.</p>
    </div>
  `;
  return transporter.sendMail({
    to: emailUser,
    subject: 'Registro exitoso',
    html: htmlContent
  });
}

module.exports = {sendConfirmEmail};