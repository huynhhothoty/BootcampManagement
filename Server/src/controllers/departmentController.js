const { departmentModel } = require('../models/departmentModel');
const crudFactory = require('../controllers/crudFactory');

const createDepartment = crudFactory.createOne(departmentModel);
const updateDepartment = crudFactory.updateOne(departmentModel);
const getDepartment = crudFactory.getOne(departmentModel, null);
const getAllDepartment = crudFactory.getAll(departmentModel);
const deleteDepartment = crudFactory.deleteOne(departmentModel);

//
module.exports = {
    createDepartment,
    updateDepartment,
    getAllDepartment,
    getDepartment,
    deleteDepartment,
};
