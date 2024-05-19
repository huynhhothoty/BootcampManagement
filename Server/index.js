require('dotenv').config();
const { app } = require('./src/server');

const port = process.env.PORT;

app.listen(port, () => {
    console.log(
        `App listening at ${process.env.NODE_ENV} mode: http://localhost:${port}`
    );
});
