const express = require('express');
const subjectController = require('../controllers/subjectController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

//
const subjectRouter = express.Router();

subjectRouter.use(authenticate);
subjectRouter
    .route('/')
    .post(authorize('leader', 'admin'), subjectController.createSubject)
    .get(subjectController.getAllSubject);

subjectRouter
    .route('/suggest')
    .get(authorize('leader', 'admin'), subjectController.getSuggestCode);

subjectRouter
    .route('/many')
    .patch(authorize('leader', 'admin'), subjectController.updateManySubject);

subjectRouter
    .route('/:id')
    .get(subjectController.getSubject)
    .patch(authorize('leader', 'admin'), subjectController.updateSubject)
    .delete(authorize('leader', 'admin'), subjectController.deleteSubject);

//
module.exports = subjectRouter;
