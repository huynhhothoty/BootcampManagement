const express = require('express')
const cors = require('cors')
const db = require('./configs/DBconfig')
const rootRouter = require('./routers/index')
const CustomError = require('./utils/CustomError')
const ErrorHandler = require('./middlewares/Error/ErrorHandler')


// Init
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// connect database
db.connect()

// json format
app.use(express.json())

// Setting cors
app.use(cors())

// set route
app.use('/api', rootRouter)

// invalid route
app.all('*', (req, res, next) => {
    next(new CustomError(`Can't find this route`, 404))
})

// middleware use to handle error
app.use(ErrorHandler)


// listening
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})