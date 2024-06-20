const mongoose = require('mongoose');

//
const subjectSnapSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject must have a name'],
    },
    shortFormName: {
        type: String,
    },
    isAutoCreateCode: {
        type: Boolean,
        default: true,
    },
    subjectCode: {
        type: String,
        default: 'SUBJECTCODE220702',
    },
    credit: {
        type: Number,
        required: [true, 'Subject must have its credit'],
        min: [1, 'credit of subject must larger than 0'],
    },
    isCompulsory: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: {
            values: ['general', 'foundation', 'major'],
            message: 'type of subject must be one of those: general, foundation, major',
        },
        required: [true, 'subject must have one of type'],
    },
    prerequisite: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
    },
    branchMajor: {
        type: mongoose.Schema.ObjectId,
        ref: 'BranchMajor',
    },
    departmentChild: {
        type: mongoose.Schema.ObjectId,
    },
    allocateChildId: {
        type: mongoose.Schema.ObjectId,
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'teacher',
    },
});
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
    allocateChildId: {
        type: mongoose.Schema.ObjectId,
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
    name: {
        type: String,
        default: 'big field 1',
    },
    isElectiveNameBaseOnBigField: {
        type: Boolean,
        default: false,
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
    subjectList: [subjectSnapSchema],
    electiveSubjectList: [electHolderSchema],
});
//
const mainSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    detail: [sectionSchema],
});
// middleware

//
const Allocation = mongoose.model('Allocation', mainSchema);
module.exports = Allocation;
