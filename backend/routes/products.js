const express = require('express');
const router = express.Router();
const { getProductsByGame } = require('../services/productService');

// Obtener productos por juego
router.get('/:game', (req, res) => {
  try {
    const { game } = req.params;
    const products = getProductsByGame(game);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos'
    });
  }
});

module.exports = router;
