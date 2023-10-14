const express = require('express');
const BCController = require('../controllers/bootcampController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const BCRouter = express.Router();

BCRouter.use(authenticate);

BCRouter.route('/')
    .post(
        authorize('leader', 'admin'),
        BCController.beforeCrud,
        BCController.createBC
    )
    .get(authorize('admin'), BCController.getAllBC);

BCRouter.route('/stats').get(authorize('admin'), BCController.getBootcampStats);
BCRouter.route('/stats/:id').get(
    authorize('admin'),
    BCController.getBootcampStats
);

BCRouter.route('/:id')
    .get(
        authorize('leader', 'admin'),
        BCController.beforeCrud,
        BCController.getBC
    )
    .patch(
        authorize('leader', 'admin'),
        BCController.beforeCrud,
        BCController.updateBC
    )
    .delete(
        authorize('leader', 'admin'),
        BCController.beforeCrud,
        BCController.deleteBC
    );

BCRouter.route('/user/:id').get(
    authorize('leader', 'admin'),
    BCController.findAllBCOfUser
);
//
module.exports = BCRouter;
