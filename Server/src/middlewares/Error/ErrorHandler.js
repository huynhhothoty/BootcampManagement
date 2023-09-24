const CustomError = require('../../utils/CustomError')

const sendErrorInDev = (err, res) => {
    res.status(err.statusCode).send({
        status: err.statusCode,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorInProd = (err, res) => {

    if(err.isOperational) {
        res.status(err.statusCode).send({
            status: err.statusCode,
            message: err.message,
        })
    } else {
        console.log('Error', err)

        res.status(500).send({
            status: 'error',
            message: 'Opps ! Something went wrong'
        })
    }
}

const handleCastError = err =>{
    const message = `Invalid ${err.path}: ${err.value}`
    return new CustomError(message, 400)
}

const errorHandler = (err, req, res, next) => {
    // console.log(err.stack)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorInDev(err, res)
    } else if (process.env.NODE_ENV === 'production'){
        let error = {...err}
        
        if(error.name === 'CastError') {
            handleCastError(error)
        }

        sendErrorInProd(err, res)
    }
}

module.exports = errorHandler