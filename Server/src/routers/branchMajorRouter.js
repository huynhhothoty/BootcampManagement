const express = require('express');
const authenticate = require('../middlewares/auth/authenticate');
const authorize = require('../middlewares/auth/authorize');
const BranchController = require('../controllers/branchMajorController');

const branchRouter = express.Router();
branchRouter.use(authenticate);
branchRouter.use(authorize('leader', 'admin'));

branchRouter
    .route('/')
    .get(BranchController.getAllBranch)
    .post(BranchController.createBranch);

branchRouter
    .route('/:id')
    .get(BranchController.getOneBranch)
    .patch(BranchController.updateBranch)
    .delete(BranchController.deleteBranch);

module.exports = branchRouter;
