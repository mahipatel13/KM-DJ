const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Reset password route
router.post('/reset', authController.resetPassword);

// Get email by userId
router.get('/userid-to-email', authController.getEmailByUserId);

// Get all users
router.get('/users', authController.getAllUsers);

// Update user role
router.put('/user/:id', authController.updateUserRole);

module.exports = router;
