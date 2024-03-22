const Bootcamp = require('../models/bootcampModel');
const CustomError = require('../utils/CustomError');
const { diff } = require('deep-diff');

const compareTwoBC = async (req, res, next) => {
    try {
        const { bootcamp1Id, bootcamp2Id } = req.body;
        if (!bootcamp1Id || !bootcamp2Id)
            return next(new CustomError('Please enter 2 bc id', 403));
        const bc1 = await Bootcamp.findById(bootcamp1Id)
            .lean()
            .populate({ path: 'allocation' });
        const bc2 = await Bootcamp.findById(bootcamp2Id)
            .lean()
            .populate({ path: 'allocation' });

        if (!bc1) return next(new CustomError('BC2 not exist', 404));
        if (!bc2) return next(new CustomError('BC2 not exist', 404));

        //
        // const diff = [];
        // if (bc1.totalCredit === bc2.totalCredit) diff.push('totalCredit');

        // const allo1 = bc1.allocation;
        // const allo2 = bc2.allocation;

        // if (allo1._id.toString() !== allo2._id.toString()) {
        //     const allocation = {};
        //     const detail1 = allo1.detail;
        //     const detail2 = allo2.detail;

        //     if (JSON.stringify(detail1) !== )
        // }

        // const checkBc1 = { ...bc1, diff };
        // const checkBc2 = { ...bc2, diff };
        const different = diff(bc1, bc2);

        res.status(200).send({
            status: 'ok',
            different,
            bootcamp1: bc1,
            bootcamp2: bc2,
        });
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};

module.exports = {
    compareTwoBC,
};
