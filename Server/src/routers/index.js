const express = require('express');
const userRouter = require('./userRouter');
const majorRouter = require('./majorRouter');
const subjectRouter = require('./subjectRouter');
const bcRouter = require('./bootcampRouter');
const alloRouter = require('./alloRouter');
const draftRouter = require('./draftRouter');
const branchRouter = require('./branchMajorRouter');
const importRouter = require('./importRouter');
const departmentRouter = require('./departmentRouter');

const rootRouter = express.Router();

// health check api
rootRouter.use('/helloworld', (req, res) => {
    res.status(200).send('Hello World!');
});

rootRouter.use('/user', userRouter);
rootRouter.use('/major', majorRouter);
rootRouter.use('/subject', subjectRouter);
rootRouter.use('/bootcamp', bcRouter);
rootRouter.use('/allocation', alloRouter);
rootRouter.use('/draft', draftRouter);
rootRouter.use('/branch', branchRouter);
rootRouter.use('/import', importRouter);
rootRouter.use('/department', departmentRouter);

//
module.exports = rootRouter;
