const { Router } = require('express');
const { importBC } = require('../controllers/importController');
const authenticate = require('../middlewares/auth/authenticate');
//
const multer = require('multer');
const authorization = require('../middlewares/auth/authorize');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const importRouter = Router();
importRouter.use(authenticate);
importRouter.use(authorization('teacher', 'admin'));

importRouter.route('/').post(upload.single('excelFile'), importBC);

module.exports = importRouter;
