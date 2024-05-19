const express = require('express');
const BCController = require('../controllers/bootcampController');
const ExportController = require('../controllers/exportController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');
const { compareTwoBC } = require('../controllers/compareController');

const BCRouter = express.Router();

BCRouter.use(authenticate);

BCRouter.route('/')
    .post(authorize('teacher', 'admin'), BCController.beforeCrud, BCController.createBC)
    .get(authorize('teacher', 'admin', ''), BCController.getAllBC);

BCRouter.route('/compare').post(compareTwoBC);

BCRouter.route('/template').post(
    authorize('teacher', 'admin'),
    BCController.beforeCrud,
    BCController.createTemplate,
    BCController.createBC
);

BCRouter.route('/detail').get(
    authorize('admin', 'teacher'),
    BCController.getAllWithDetail
);

BCRouter.route('/stats').get(
    authorize('teacher', 'admin'),
    BCController.getBootcampStats
);
BCRouter.route('/stats/:id').get(
    authorize('teacher', 'admin'),
    BCController.getBootcampStats
);

BCRouter.route('/:id/export').get(
    authorize('teacher', 'admin'),
    ExportController.exportFileExcel
);

BCRouter.route('/:id')
    .get(authorize('teacher', 'admin'), BCController.beforeCrud, BCController.getBC)
    .patch(authorize('teacher', 'admin'), BCController.beforeCrud, BCController.updateBC)
    .delete(
        authorize('teacher', 'admin'),
        BCController.beforeCrud,
        BCController.deleteBC
    );

BCRouter.route('/user/:id').get(
    authorize('teacher', 'admin'),
    BCController.findAllBCOfUser
);
//
module.exports = BCRouter;
