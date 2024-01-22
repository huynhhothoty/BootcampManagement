const mongoose = require('mongoose');
const Major = require('../models/majorModel');
const CustomError = require('../utils/CustomError');

//
const semesterSchema = new mongoose.Schema({
    semester: {
        type: String,
        default: 'Semester 1',
    },
    subjectList: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
    trackingList: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
});
const bootcampSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: 'My new bootcamp',
        },
        major: {
            type: mongoose.Schema.ObjectId,
            ref: 'Major',
            required: [true, 'Bootcamp must have its major'],
        },
        type: {
            type: String,
            enum: ['template', 'bootcamp'],
            default: 'bootcamp',
        },
        year: {
            type: Number,
            default: new Date().year,
        },
        totalCredit: {
            type: Number,
            default: 0,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        draft: {
            type: Boolean,
            default: false,
        },
        allocation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Allocation',
        },
        detail: [semesterSchema],
    },
    {
        timestamps: true,
    }
);
// middleware
// bootcampSchema.pre(/^find/, async function () {
//    this.where({type: ''})
// });
bootcampSchema.pre('save', function () {
    this.populate('major');
    this.populate('author');
    this.populate('allocation');
    this.populate({
        path: 'detail',
        populate: { path: 'subjectList', model: 'Subject' },
    });
});

bootcampSchema.post('save', async function (doc, next) {
    if (doc.type === 'template') {
        const major = await Major.findById(doc.major);
        if (!major) return next(new CustomError('This major Id is not exist', 404));
        major.templateBootcamp = doc._id;
        await major.save();
    }
});
//
const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
module.exports = Bootcamp;
