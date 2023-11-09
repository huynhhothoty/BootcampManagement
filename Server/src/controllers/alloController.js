const Allocation = require('../models/allocationModel');
const crudFactory = require('./crudFactory');
//

const createAllo = crudFactory.createOne(Allocation);
const updateAllo = crudFactory.updateOne(Allocation);
const getAllo = crudFactory.getOne(Allocation, [
    {
        path: 'detail.subjectList',
    },
    { path: 'detail.electiveSubjectList.branchMajor' },
]);
const deleteAllo = crudFactory.deleteOne(Allocation);

//
module.exports = {
    createAllo,
    updateAllo,
    getAllo,
    deleteAllo,
};
