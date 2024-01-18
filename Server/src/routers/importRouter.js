const { Router } = require('express');
const { importBC } = require('../controllers/importController');
const authenticate = require('../middlewares/auth/authenticate');
//
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const importRouter = Router();
importRouter.use(authenticate);

importRouter.route('/').post(upload.single('excelFile'), importBC);

module.exports = importRouter;
