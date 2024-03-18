const mongoose = require('mongoose');
const BranchMajor = require('../models/branchMajorModel');

const majorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Major must have name'],
            unique: [true, 'Major must be unique value'],
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

//
const Major = mongoose.model('Major', majorSchema);
module.exports = Major;
