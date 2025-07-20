const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const productController = require('../controllers/productController');


router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post('/', authenticate, role('admin'), productController.createProduct);

router.put('/:id', authenticate, role('admin'), productController.updateProduct);

router.delete('/:id', authenticate, role('admin'), productController.deleteProduct);

module.exports = router;
