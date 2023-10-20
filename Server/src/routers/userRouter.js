const express = require('express');
const userController = require('../controllers/userController');
const authentication = require('../middlewares/auth/authenticate');
const authorization = require('../middlewares/auth/authorize');

const userRouter = express.Router();

userRouter.get(
    '/',
    authentication,
    authorization('admin'),
    userController.getAllUser
);
userRouter.get(
    '/:id',
    authentication,
    authorization('admin'),
    userController.getOneUser
);

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/forgetpassword', userController.forgetPassoword);

userRouter.patch(
    '/changepassword',
    authentication,
    userController.updatePassword
);
userRouter.patch('/changeinfo', authentication, userController.updateInfo);
userRouter.patch('/resetpassword/:token', userController.resetPassword);

//
module.exports = userRouter;
