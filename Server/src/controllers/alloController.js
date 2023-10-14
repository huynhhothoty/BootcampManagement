const Allocation = require('../models/allocationModel');
const crudFactory = require('./crudFactory');
//

const createAllo = crudFactory.createOne(Allocation);
const updateAllo = crudFactory.updateOne(Allocation);
const getAllo = crudFactory.getOne(Allocation, {
    path: 'detail',
    populate: { path: 'subjectList', model: 'Subject' },
});
const deleteAllo = crudFactory.deleteOne(Allocation);

//
module.exports = {
    createAllo,
    updateAllo,
    getAllo,
    deleteAllo,
};
