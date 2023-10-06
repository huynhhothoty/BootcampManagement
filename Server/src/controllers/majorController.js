const Major = require('../models/majorModel');
const crudFactory = require('../controllers/crudFactory');

const createMajor = crudFactory.createOne(Major);
const updateMajor = crudFactory.updateOne(Major);
const getMajor = crudFactory.getOne(Major, null);
const getAllMajor = crudFactory.getAll(Major);
const deleteMajor = crudFactory.deleteOne(Major);

//
module.exports = {
    createMajor,
    updateMajor,
    getAllMajor,
    getMajor,
    deleteMajor,
};
