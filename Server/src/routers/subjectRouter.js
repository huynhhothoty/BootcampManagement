const express = require('express');
const subjectController = require('../controllers/subjectController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

//
const subjectRouter = express.Router();

subjectRouter.use(authenticate);
subjectRouter
    .route('/')
    .post(authorize('teacher', 'admin'), subjectController.createSubject)
    .get(subjectController.getAllSubject);

subjectRouter
    .route('/suggest')
    .get(authorize('teacher', 'admin'), subjectController.getSuggestCode);

subjectRouter
    .route('/many')
    .patch(authorize('teacher', 'admin'), subjectController.updateManySubject);

subjectRouter
    .route('/:id')
    .get(subjectController.getSubject)
    .patch(authorize('teacher', 'admin'), subjectController.updateSubject)
    .delete(authorize('teacher', 'admin'), subjectController.deleteSubject);

//
module.exports = subjectRouter;
