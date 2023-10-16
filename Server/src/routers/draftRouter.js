const express = require('express');
const draftController = require('../controllers/draftController');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');

const draftRouter = express.Router();
draftRouter.use(authenticate);
draftRouter.use(authorize('leader', 'admin'));
draftRouter.use(draftController.getUserInfo);

draftRouter
    .route('/')
    .post(draftController.createDraft)
    .get(draftController.getAllDraft);

draftRouter
    .route('/:id')
    .patch(draftController.updateDraft)
    .get(draftController.getDraft)
    .delete(draftController.deleteDraft);

module.exports = draftRouter;
