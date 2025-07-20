const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');


router.get('/', authenticate, cartController.getCart);


router.post('/add', authenticate, cartController.addToCart);


router.put('/update/:productId', authenticate, cartController.updateQuantity);


router.delete('/remove/:productId', authenticate, cartController.removeFromCart);


router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;
