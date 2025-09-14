const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  logout 
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  validateRegister, 
  validateLogin, 
  validateUserUpdate 
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(authenticateToken); 

router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);


module.exports = router;