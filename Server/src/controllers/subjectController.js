const Subject = require('../models/subjectModel');
const crudFactory = require('./crudFactory');
const CustomError = require('../utils/CustomError');
const ApiFeatures = require('../utils/ApiFeature');
const Major = require('../models/majorModel');

//
const createSubject = crudFactory.createOne(Subject);
const updateSubject = crudFactory.updateOne(Subject);
const getSubject = crudFactory.getOne(Subject, 'branchMajor');
const getAllSubject = async (req, res, next) => {
    try {
        const { majorId, ...otherQuery } = req.query;

        let departmentChildOfMajor;
        let databaseQuery, databaseQuery2;
        if (majorId) {
            const major = await Major.findById(majorId).populate('department').lean();
            if (!major) return next(new CustomError('No major with this id', 404));

            departmentChildOfMajor = major.department.reduce((acc, cur) => {
                acc = [...acc, ...cur.list];
                return acc;
            }, []);

            const departChildIdList = departmentChildOfMajor.map((ele) => ele._id);

            databaseQuery = Subject.find({
                departmentChild: { $in: departChildIdList },
            }).lean();
            databaseQuery2 = Subject.find({
                departmentChild: { $in: departChildIdList },
            }).lean();
        } else {
            databaseQuery = Subject.find().lean();
            databaseQuery2 = Subject.find().lean();
        }

        const apiFeat = new ApiFeatures(databaseQuery, otherQuery);
        const apiFeat2 = new ApiFeatures(databaseQuery2, otherQuery);
        apiFeat.filter().sorting().pagination();
        apiFeat2.filter();

        const docs = await apiFeat.myQuery;
        const docsOnlyFilter = await apiFeat2.myQuery;

        res.status(200).send({
            status: 'ok',
            total: docsOnlyFilter.length,
            data: docs,
        });
    } catch (error) {
        console.log(error);
        return next(new CustomError(error));
    }
};
const deleteSubject = crudFactory.deleteOne(Subject);
const updateManySubject = crudFactory.updateMany(Subject);

const getSuggestCode = async (req, res, next) => {
    try {
        if (!req.query.name) {
            return next(new CustomError('Please provide subject name', 400));
        }
        let subName = req.query.name;
        const regexPattern = new RegExp(subName, 'ig');
        const filter = {
            name: regexPattern,
        };
        const myquery = Subject.find(filter)
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('subjectCode');
        let similarCodeList = await myquery;

        let suggestCode = '';
        subName.split(' ').map((word) => {
            if (word.length > 0) {
                suggestCode += word[0].toUpperCase();
            }
        });
        suggestCode += new Date().getFullYear().toString();

        res.status(200).send({
            status: 'ok',
            detail: {
                suggestCode,
                similarCodeList,
            },
        });
    } catch (error) {
        console.log(error);
        return next(new CustomError(error));
    }
};
//
module.exports = {
    createSubject,
    updateSubject,
    getAllSubject,
    getSubject,
    deleteSubject,
    getSuggestCode,
    updateManySubject,
};
