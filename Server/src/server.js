const express = require('express');
const cors = require('cors');
const db = require('./configs/DBconfig');
const rootRouter = require('./routers/index');
const CustomError = require('./utils/CustomError');
const ErrorHandler = require('./middlewares/Error/ErrorHandler');

// Init
const app = express();

// connect database
db.connect();

// json format
app.use(express.json());

// Setting cors
const feLink =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : process.env.FE_LINK;
const corsOptions = {
    origin: feLink,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// set route
app.use('/api', rootRouter);

// invalid route
app.all('*', (req, res, next) => {
    next(new CustomError(`Can't find this route`, 404));
});

// middleware use to handle error
app.use(ErrorHandler);

module.exports = {
    app,
};
