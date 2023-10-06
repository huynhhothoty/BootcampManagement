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

//
module.exports = {
    createBC,
    updateBC,
    getBC,
    getAllBC,
    deleteBC,
    beforeCrud,
};
