const express = require('express')
const cors = require('cors')


// Init
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 3001

// json format
app.use(express.json())

// Setting cors
app.use(cors())

// listening
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})