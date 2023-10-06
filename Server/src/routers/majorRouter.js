const express = require('express');
const majorController = require('../controllers/majorController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const majorRouter = express.Router();

majorRouter.use(authenticate);
majorRouter
    .route('/')
    .post(authorize('admin'), majorController.createMajor)
    .get(authorize('admin'), majorController.getAllMajor);

majorRouter
    .route('/:id')
    .get(majorController.getMajor)
    .patch(authorize('admin'), majorController.updateMajor)
    .delete(authorize('admin'), majorController.deleteMajor);

//
module.exports = majorRouter;
