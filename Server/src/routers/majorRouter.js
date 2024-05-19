const express = require('express');
const majorController = require('../controllers/majorController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const majorRouter = express.Router();

majorRouter.use(authenticate);
majorRouter
    .route('/')
    .post(authorize('admin'), majorController.createMajor)
    .get(majorController.getAllMajor);

majorRouter.route('/:id/subjects').get(majorController.getAllSubjectOfMajor);

majorRouter
    .route('/:id')
    .get(majorController.getMajor)
    .patch(majorController.updateMajor);

//
module.exports = majorRouter;
