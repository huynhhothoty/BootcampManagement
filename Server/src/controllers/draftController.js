const Draft = require('../models/draftModel');
const crudFactory = require('./crudFactory');

const createDraft = crudFactory.createOne(Draft);
const updateDraft = crudFactory.updateOne(Draft);
const getDraft = crudFactory.getOne(Draft);
const getAllDraft = crudFactory.getAll(Draft);
const deleteDraft = crudFactory.deleteOne(Draft);

module.exports = {
    createDraft,
    updateDraft,
    getDraft,
    getAllDraft,
    deleteDraft,
};
