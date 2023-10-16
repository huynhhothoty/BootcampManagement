const Draft = require('../models/draftModel');
const crudFactory = require('./crudFactory');

const createDraft = crudFactory.createOne(Draft);
const updateDraft = crudFactory.updateOne(Draft);
const getDraft = crudFactory.getOne(Draft);
const getAllDraft = crudFactory.getAll(Draft);
const deleteDraft = crudFactory.deleteOne(Draft);

// before draft
const getUserInfo = (req, res, next) => {
    if (!req.body.author) {
        req.body.author = req.user.id;
    }
    next();
};

module.exports = {
    createDraft,
    updateDraft,
    getDraft,
    getAllDraft,
    deleteDraft,
    getUserInfo,
};
