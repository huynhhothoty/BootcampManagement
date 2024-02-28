const mongoose = require('mongoose');

//
const electHolderSchema = new mongoose.Schema({
    credit: {
        type: Number,
        default: 0,
    },
    semester: {
        type: Number,
        default: 1,
    },
    name: {
        type: String,
        default: 'BigfieldName+STT',
    },
    branchMajor: {
        type: mongoose.Schema.ObjectId,
        ref: 'BranchMajor',
    },
    tracking: {
        type: Boolean,
        default: false,
    },
});

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'small field 1',
    },
    compulsoryCredit: {
        type: Number,
        default: 0,
    },
    OptionalCredit: {
        type: Number,
        default: 0,
    },
});
const sectionSchema = new mongoose.Schema({
    _id: false,
    name: {
        type: String,
        default: 'big field 1',
    },
    compulsoryCredit: {
        type: Number,
        default: 0,
    },
    OptionalCredit: {
        type: Number,
        default: 0,
    },
    detail: [childSchema],
    subjectList: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject',
        },
    ],
    electiveSubjectList: [electHolderSchema],
});
//
const mainSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    detail: [sectionSchema],
});
// middleware

//
const Allocation = mongoose.model('Allocation', mainSchema);
module.exports = Allocation;
