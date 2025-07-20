const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.get('/', authenticate, role('admin'), userController.getAllUsers);


router.get('/me', authenticate, role('user', 'admin'), userController.getUserProfile);

router.put('/:id', authenticate, userController.updateUser);

module.exports = router;
