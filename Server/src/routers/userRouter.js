const express = require('express')
const userController = require('../controllers/userController')
const authentication = require('../middlewares/auth/authenticate')
const authorization = require('../middlewares/auth/authorize')

const userRouter = express.Router()

userRouter.get('/', authentication, authorization('admin'), userController.getAllUser)

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/forgetpassword', userController.forgetPassoword)

userRouter.patch('/resetpassword/:token', userController.resetPassword)

// 
module.exports = userRouter
