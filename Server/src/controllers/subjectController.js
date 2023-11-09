const Subject = require('../models/subjectModel');
const crudFactory = require('./crudFactory');
const CustomError = require('../utils/CustomError');

//
const createSubject = crudFactory.createOne(Subject);
const updateSubject = crudFactory.updateOne(Subject);
const getSubject = crudFactory.getOne(Subject, 'branchMajor');
const getAllSubject = crudFactory.getAll(Subject);
const deleteSubject = crudFactory.deleteOne(Subject);

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
};
