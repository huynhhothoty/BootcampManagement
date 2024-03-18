const express = require('express');
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const departmentRouter = express.Router();
departmentRouter.use(authenticate);
departmentRouter.use(authorize('leader', 'admin'));

departmentRouter
    .route('/')
    .post(departmentController.createDepartment)
    .get(departmentController.getAllDepartment);

departmentRouter
    .route('/:id')
    .patch(departmentController.updateDepartment)
    .get(departmentController.getDepartment)
    .delete(departmentController.deleteDepartment);

module.exports = departmentRouter;
