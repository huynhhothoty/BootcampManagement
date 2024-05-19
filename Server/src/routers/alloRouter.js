const express = require('express');
const alloController = require('../controllers/alloController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const alloRouter = express.Router();
alloRouter.use(authenticate);
alloRouter.use(authorize('teacher', 'admin'));
//
alloRouter.route('/').post(alloController.createAllo);

alloRouter
    .route('/:id')
    .patch(alloController.updateAllo)
    .delete(alloController.deleteAllo)
    .get(alloController.getAllo);

module.exports = alloRouter;
