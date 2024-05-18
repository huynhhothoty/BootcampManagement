const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'BranchMajor must have name'],
        unique: [true, 'BranchMajor must be unique value'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    branchCode: {
        type: String,
        required: [true, 'BranchMajor must have Branchmajor code'],
        unique: [true, 'BranchMajor code must be unique'],
    },
    summary: {
        type: String,
        default: 'This is a description of a Branchmajor, you can custom this field',
    },
});

branchSchema.pre(/^find/, function () {
    this.select('-__v');
});

const BranchMajor = mongoose.model('BranchMajor', branchSchema);

module.exports = BranchMajor;
