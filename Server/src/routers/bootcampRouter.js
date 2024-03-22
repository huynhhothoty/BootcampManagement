const express = require('express');
const BCController = require('../controllers/bootcampController');
const ExportController = require('../controllers/exportController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');
const { compareTwoBC } = require('../controllers/compareController');

const BCRouter = express.Router();

BCRouter.use(authenticate);

BCRouter.route('/')
    .post(authorize('leader', 'admin'), BCController.beforeCrud, BCController.createBC)
    .get(authorize('admin', 'leader'), BCController.getAllBC);

BCRouter.route('/compare').post(compareTwoBC);

BCRouter.route('/template').post(
    authorize('leader', 'admin'),
    BCController.beforeCrud,
    BCController.createTemplate,
    BCController.createBC
);

BCRouter.route('/detail').get(
    authorize('admin', 'leader'),
    BCController.getAllWithDetail
);

BCRouter.route('/stats').get(authorize('admin'), BCController.getBootcampStats);
BCRouter.route('/stats/:id').get(authorize('admin'), BCController.getBootcampStats);

BCRouter.route('/:id/export').get(
    authorize('leader', 'admin'),
    ExportController.exportFileExcel
);

BCRouter.route('/:id')
    .get(authorize('leader', 'admin'), BCController.beforeCrud, BCController.getBC)
    .patch(authorize('leader', 'admin'), BCController.beforeCrud, BCController.updateBC)
    .delete(authorize('leader', 'admin'), BCController.beforeCrud, BCController.deleteBC);

BCRouter.route('/user/:id').get(
    authorize('leader', 'admin'),
    BCController.findAllBCOfUser
);
//
module.exports = BCRouter;
