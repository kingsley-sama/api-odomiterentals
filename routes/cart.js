// routes/cartRoutes.js
const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.addToCart);
router.delete('/:user/:itemId', cartController.removeFromCart);
router.get('/:user', cartController.getCart);

module.exports = cartRouter
