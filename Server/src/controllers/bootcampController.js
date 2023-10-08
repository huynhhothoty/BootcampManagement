const Bootcamp = require('../models/bootcampModel');
const crudFactory = require('./crudFactory');
const CustomError = require('../utils/CustomError');

//
const createBC = crudFactory.createOne(Bootcamp);
const updateBC = crudFactory.updateOne(Bootcamp);
const getBC = crudFactory.getOne(Bootcamp, [
    { path: 'major' },
    {
        path: 'detail',
        populate: { path: 'subjectList', model: 'Subject' },
    },
]);
const getAllBC = crudFactory.getAll(Bootcamp);
const deleteBC = crudFactory.deleteOne(Bootcamp);
//
const beforeCrud = async (req, res, next) => {
    try {
        if (req.user.role != 'admin') {
            const userMajor = req.user.major._id;
            if (!req.params.id) {
                if (req.body.major != userMajor)
                    return next(
                        new CustomError(
                            'Your major do not have permission to perform this action!',
                            401
                        )
                    );
                req.body.author = req.user.id;
            } else {
                const thisBC = await Bootcamp.findById(req.params.id).select(
                    'major'
                );

                if (thisBC && thisBC.major.toString() !== userMajor.toString())
                    return next(
                        new CustomError(
                            'Your major do not have permission to perform this action',
                            401
                        )
                    );
            }
        }
        next();
    } catch (error) {
        console.log(error);
        return next(new CustomError(error));
    }
};

const getBootcampStats = async (req, res, next) => {
    try {
        let filter = {};
        if (req.params.id) filter = { _id: req.params.id };
        let result = [];
        const bcList = await Bootcamp.find(filter).populate({
            path: 'detail',
            populate: { path: 'subjectList', model: 'Subject' },
        });
        bcList.forEach((ele) => {
            let temp = {};
            temp['id'] = ele._id;
            //
            let data = ele.detail;

            let SemesterQuantity = data.length;
            let SubjectQuantity = 0;
            let CompulsorySubject = 0;
            let typeSubject = {
                general: 0,
                foundation: 0,
                major: 0,
            };
            data.forEach((ele2) => {
                SubjectQuantity += ele2.subjectList.length;
                ele2.subjectList.forEach((ele3) => {
                    if (ele3.isCompulsory) {
                        CompulsorySubject++;
                    }
                    typeSubject[`${ele3.type}`]++;
                });
            });
            const tempResult = {
                SemesterQuantity,
                SubjectQuantity,
                CompulsorySubject,
                OptionalSubject: SubjectQuantity - CompulsorySubject,
                GeneralSubject: typeSubject.general,
                FoundationSubject: typeSubject.foundation,
                MajorSubject: typeSubject.major,
            };
            result.push(tempResult);
        });
        res.status(200).send({
            status: 'ok',
            total: bcList.length,
            detail: result,
        });
    } catch (error) {
        console.log(error);
        return next(new CustomError(error));
    }
};

//
module.exports = {
    createBC,
    updateBC,
    getBC,
    getAllBC,
    deleteBC,
    beforeCrud,
    getBootcampStats,
};
