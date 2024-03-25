const Allocation = require('../models/allocationModel');
const CustomError = require('../utils/CustomError');
const crudFactory = require('./crudFactory');
//

const createAllo = crudFactory.createOne(Allocation);
const getAllo = crudFactory.getOne(Allocation, [
    {
        path: 'detail.subjectList',
    },
    { path: 'detail.electiveSubjectList.branchMajor' },
]);
const deleteAllo = crudFactory.deleteOne(Allocation);
const updateAllo = async (req, res, next) => {
    try {
        let updateDoc = await Allocation.findById(req.params.id).lean();
        const updateInfo = req.body;

        if (!updateDoc) return next(new CustomError('No document with this id', 404));
        if (Object.keys(updateInfo).includes('detail')) {
            let temp = updateInfo.detail.map((big, index) => {
                if (index > updateDoc.detail.length - 1) return big;

                let newSubList = big.subjectList;
                let oldSubList = updateInfo.detail[index].subjectList;
                newSubList.forEach((sub) => {
                    if (sub?.isDelete) {
                        oldSubList = oldSubList.filter(
                            (x) => x._id.toString() !== sub._id.toString()
                        );
                    } else {
                        if (!sub?._id) oldSubList = [...oldSubList, sub];
                        else
                            oldSubList = oldSubList.map((oldSub) => {
                                if (oldSub._id.toString() === sub._id) return sub;
                                return oldSub;
                            });
                    }
                });
                updateInfo.detail[index].subjectList = oldSubList;

                return updateInfo.detail[index];
            });
            // if (updateInfo.detail.length > updateDoc.detail.length) {
            //     for (let i = updateDoc.detail.length; i < updateInfo.detail.length; i++) {
            //         temp = [...temp, updateInfo.detail[i]];
            //     }
            // }
            updateInfo.detail = temp;
        }
        const doc = await Allocation.findByIdAndUpdate(req.params.id, updateInfo, {
            new: true,
            runValidators: true,
        });

        res.status(200).send({
            status: 'ok',
            data: doc,
        });
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};

//
module.exports = {
    createAllo,
    updateAllo,
    getAllo,
    deleteAllo,
};
