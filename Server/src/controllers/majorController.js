const Major = require('../models/majorModel');
const crudFactory = require('../controllers/crudFactory');
const CustomError = require('../utils/CustomError');
const Subject = require('../models/subjectModel');

const createMajor = crudFactory.createOne(Major);
const updateMajor = crudFactory.updateOne(Major);
const getMajor = crudFactory.getOne(Major, ['branchMajor', 'department']);
const getAllMajor = crudFactory.getAll(Major);
const deleteMajor = crudFactory.deleteOne(Major);

const getAllSubjectOfMajor = async (req, res, next) => {
    try {
        const doc = await Major.findById(req.params.id).lean().populate('department');

        let allDepartmentChildList = [];
        doc.department.forEach((depart) => {
            depart.list.forEach((child) => {
                allDepartmentChildList.push(child._id);
            });
        });

        let subjectList = [];
        // for (let item of allDepartmentChildList) {
        //     const temp = await Subject.find({ departmentChild: item }).lean();
        //     subjectList = [...subjectList, ...temp];
        // }
        const promises = allDepartmentChildList.map(async (item) => {
            const x = await Subject.find({ departmentChild: item }).lean();
            return x;
        });

        const temp = await Promise.all(promises);

        temp.forEach((ele) => {
            subjectList = [...subjectList, ...ele];
        });

        res.status(200).send({
            status: 'ok',
            data: subjectList,
        });
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};

//
module.exports = {
    createMajor,
    updateMajor,
    getAllMajor,
    getMajor,
    deleteMajor,
    getAllSubjectOfMajor,
};
