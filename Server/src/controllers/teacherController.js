const Teacher = require('../models/teacherModel');
const crudFactory = require('./crudFactory');

const createTeacher = crudFactory.createOne(Teacher);
const updateTeacher = crudFactory.updateOne(Teacher);
const getAllTeacher = crudFactory.getAll(Teacher);
const getOneTeacher = crudFactory.getOne(Teacher, null);
const deleteTeacher = crudFactory.createOne(Teacher);

module.exports = {
    createTeacher,
    updateTeacher,
    getAllTeacher,
    getOneTeacher,
    deleteTeacher,
};
