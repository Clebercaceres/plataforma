const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../services/orderService');
const { updateUserPreferences, markFirstPurchase } = require('../services/userService');

// Crear una nueva orden
router.post('/', async (req, res) => {
  try {
    const { 
      userId,
      game,
      gameId,
      productId,
      productName,
      quantity,
      price,
      originalPrice,
      hasDiscount,
      paymentMethod
    } = req.body;

    // Crear la orden
    const order = await createOrder({
      userId,
      game,
      gameId,
      productId,
      productName,
      quantity,
      price,
      originalPrice,
      hasDiscount,
      paymentMethod
    });

    // Si es la primera compra, marcar al usuario
    if (hasDiscount) {
      await markFirstPurchase(userId);
    }

    res.json({
      success: true,
      order,
      message: 'Orden creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear la orden'
    });
  }
});

// Obtener órdenes de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await getUserOrders(userId);
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las órdenes'
    });
  }
});

module.exports = router;
