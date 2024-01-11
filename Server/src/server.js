const express = require('express');
const cors = require('cors');
const db = require('./configs/DBconfig');
const rootRouter = require('./routers/index');
const CustomError = require('./utils/CustomError');
const ErrorHandler = require('./middlewares/Error/ErrorHandler');


// Init
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// connect database
db.connect();

// json format
app.use(express.json());

// Setting cors
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// set route
app.use('/api', rootRouter);

//Test Upload file
const exceljs = require('exceljs')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });

app.post('/api/testGetFile',upload.single("excelFile"),async (req,res) => {
    
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(`src/${req.file.filename}`);
    const worksheet = workbook.getWorksheet(1);
    const rows = worksheet.getSheetValues();
    console.log(rows)
    res.status(200).send({status:"ok"})
})
// Test upload file

// invalid route
app.all('*', (req, res, next) => {
    next(new CustomError(`Can't find this route`, 404));
});

// middleware use to handle error
app.use(ErrorHandler);

// listening
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
