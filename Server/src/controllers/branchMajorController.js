const BranchMajor = require('../models/branchMajorModel');
const crudFactory = require('./crudFactory');

const createBranch = crudFactory.createOne(BranchMajor);
const updateBranch = crudFactory.updateOne(BranchMajor);
const getAllBranch = crudFactory.getAll(BranchMajor);
const getOneBranch = crudFactory.getOne(BranchMajor, null);
const deleteBranch = crudFactory.createOne(BranchMajor);

module.exports = {
    createBranch,
    updateBranch,
    getAllBranch,
    getOneBranch,
    deleteBranch,
};
