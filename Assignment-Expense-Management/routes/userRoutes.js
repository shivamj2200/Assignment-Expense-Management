const express = require('express'); //import express

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const joiValidator = require('../services/joi_validation');

router.post('/login', joiValidator.loginValidation, authController.login);
router.post('/create', joiValidator.createValidation, userController.create);
router.delete('/delete/:id', userController.delete);
router.patch('/edit/:id', userController.edit);
router.get('/getuser', userController.getAll);
router.get('/getOne/:id', userController.getOne);

router.post('/forgotpassword/', userController.forgotPassword);
router.patch(
  '/resetpassword/:id',
  joiValidator.updatePassword,
  userController.resetPassword
);

module.exports = router; // export to use in server.js
