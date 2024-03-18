const { departmentModel } = require('../models/departmentModel');
const crudFactory = require('../controllers/crudFactory');
const CustomError = require('../utils/CustomError');

const createDepartment = crudFactory.createOne(departmentModel);
const updateDepartment = crudFactory.updateOne(departmentModel);
const getDepartment = crudFactory.getOne(departmentModel, null);
const getAllDepartment = crudFactory.getAll(departmentModel);
const deleteDepartment = crudFactory.deleteOne(departmentModel);
const getDepartmentChild = async (req, res, next) => {
    try {
        const childId = req.params.id;
        const department = await departmentModel.findOne({
            list: { $elemMatch: { _id: childId } },
        });
        if (!department)
            return next(new CustomError('No department has this child id', 404));

        const childInfo = department.list.find((ele) => ele._id.toString() === childId);

        res.status(200).send({
            status: 'ok',
            data: childInfo,
        });
    } catch (error) {
        console.log(error);
        return next(new CustomError(error));
    }
};

//
module.exports = {
    createDepartment,
    updateDepartment,
    getAllDepartment,
    getDepartment,
    deleteDepartment,
    getDepartmentChild,
};
