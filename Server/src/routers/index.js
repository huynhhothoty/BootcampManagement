const express = require('express');
const userRouter = require('./userRouter');
const majorRouter = require('./majorRouter');
const subjectRouter = require('./subjectRouter');
const bcRouter = require('./bootcampRouter');
const alloRouter = require('./alloRouter');
const draftRouter = require('./draftRouter');
const branchRouter = require('./branchMajorRouter');

const rootRouter = express.Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/major', majorRouter);
rootRouter.use('/subject', subjectRouter);
rootRouter.use('/bootcamp', bcRouter);
rootRouter.use('/allocation', alloRouter);
rootRouter.use('/draft', draftRouter);
rootRouter.use('/branch', branchRouter);

//
module.exports = rootRouter;
