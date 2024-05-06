const Bootcamp = require('../models/bootcampModel');
const crudFactory = require('./crudFactory');
const CustomError = require('../utils/CustomError');
const ApiFeature = require('../utils/ApiFeature');

//
const createBC = crudFactory.createOne(Bootcamp);
const updateBC = crudFactory.updateOne(Bootcamp);

const getBC = async (req, res, next) => {
    try {
        const doc = await Bootcamp.findById(req.params.id)
            .lean()
            .populate([
                { path: 'major' },
                {
                    path: 'major',
                    populate: { path: 'branchMajor' },
                },
                {
                    path: 'allocation',
                },
            ]);

        if (!doc) {
            return next(new CustomError('No document with this Id', 404));
        }

        // fill and replace id in subject list by subject info in allocation
        let alloSubList = [];
        doc.allocation.detail.map((big) => {
            alloSubList = [...alloSubList, ...big.subjectList];
        });

        const populateDetail = doc.detail.map((semester) => {
            const populateSemester = semester.subjectList
                .map((subjectId) => {
                    return (
                        alloSubList.find(
                            (ele) => ele._id.toString() === subjectId.toString()
                        ) ?? ''
                    );
                })
                .filter((x) => x != '');
            semester.subjectList = populateSemester;
            return semester;
        });
        doc.detail = populateDetail;

        res.status(200).send({
            status: 'ok',
            data: doc,
        });
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};
const getAllBC = crudFactory.getAll(Bootcamp);
const deleteBC = crudFactory.deleteOne(Bootcamp);
// function use to check if user's major is legal for operating a bootcamp
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
                const thisBC = await Bootcamp.findById(req.params.id).select('major');

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

const createTemplate = async (req, res, next) => {
    try {
        req.body.type = 'template';
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
            let currentCredit = 0;
            let compulsoryCredit = 0;
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
                        compulsoryCredit += ele3.credit;
                    }
                    typeSubject[`${ele3.type}`]++;
                    currentCredit += ele3.credit;
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
                currentCredit,
                compulsoryCredit,
                optionalCredit: currentCredit - compulsoryCredit,
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

const getAllWithDetail = async (req, res, next) => {
    try {
        //

        const query = Bootcamp.find()
            .lean()
            .populate([
                { path: 'major' },
                {
                    path: 'major',
                    populate: { path: 'branchMajor' },
                },
                {
                    path: 'allocation',
                },
                {
                    path: 'author',
                },
            ]);
        const apiFeat = new ApiFeature(query, req.query);
        apiFeat.filter().sorting().pagination();

        const docs = await apiFeat.myQuery;

        docs.forEach((doc) => {
            let alloSubList = [];
            doc.allocation.detail.map((big) => {
                alloSubList = [...alloSubList, ...big.subjectList];
            });

            const populateDetail = doc.detail.map((semester) => {
                const populateSemester = semester.subjectList
                    .map((subjectId) => {
                        return (
                            alloSubList.find(
                                (ele) => ele._id.toString() === subjectId.toString()
                            ) ?? ''
                        );
                    })
                    .filter((x) => x != '');
                semester.subjectList = populateSemester;
                return semester;
            });
            doc.detail = populateDetail;
        });

        res.status(200).send({
            status: 'ok',
            total: docs.length,
            data: docs,
        });
    } catch (error) {
        return next(new CustomError(error));
    }
};

const findAllBCOfUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const bcList = await Bootcamp.find({ author: id });
        res.status(200).send({
            total: bcList.length,
            status: 'ok',
            data: bcList,
        });
    } catch (error) {
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
    findAllBCOfUser,
    getAllWithDetail,
    createTemplate,
};
