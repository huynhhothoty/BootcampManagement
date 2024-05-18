const mongoose = require('mongoose');
const BranchMajor = require('../models/branchMajorModel');
const Bootcamp = require('./bootcampModel');
const User = require('./userModel');

const majorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Major must have name'],
            unique: [true, 'Major must be unique value'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        majorCode: {
            type: String,
            required: [true, 'Major must have major code'],
            unique: [true, 'Major code must be unique'],
        },
        summary: {
            type: String,
            default: 'This is a description of a major, you can custom this field',
        },
        branchMajor: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'BranchMajor',
            },
        ],
        templateBootcamp: {
            type: mongoose.Schema.ObjectId,
            ref: 'Bootcamp',
        },
        department: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Department',
            },
        ],
    },
    {
        timestamps: true,
    }
);
//
majorSchema.pre(/^find/, function () {
    this.select('-createdAt -updatedAt -__v');
});

majorSchema.post('findOneAndDelete', async function (doc) {
    await BranchMajor.deleteMany({ _id: { $in: doc.branchMajor } });
});

majorSchema.post('findOneAndUpdate', async function (doc, next) {
    if (!('isActive' in this.getUpdate().$set)) next();

    const isActive = this.getUpdate().$set.isActive;

    await Bootcamp.updateMany({ major: doc._id }, { isActive }).lean();
    await User.updateMany({ major: doc._id }, { isActive }).lean();
    await BranchMajor.updateMany({ _id: { $in: doc.branchMajor } }, { isActive }).lean();
});

//
const Major = mongoose.model('Major', majorSchema);
module.exports = Major;
