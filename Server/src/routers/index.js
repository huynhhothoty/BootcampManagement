const express = require('express')
const userRouter = require('./userRouter')

const rootRouter = express.Router()

rootRouter.use('/user', userRouter)

//
module.exports = rootRouter