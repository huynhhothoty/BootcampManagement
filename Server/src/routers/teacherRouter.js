const express = require('express');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');
const {
    createTeacher,
    getAllTeacher,
    getOneTeacher,
    updateTeacher,
} = require('../controllers/teacherController');

const teacherRouter = express.Router();
teacherRouter.use(authenticate);
teacherRouter.use(authorize('teacher', 'admin'));

teacherRouter.route('/').get(getAllTeacher).post(createTeacher);

teacherRouter.route('/:id').get(getOneTeacher).patch(updateTeacher);

module.exports = teacherRouter;
