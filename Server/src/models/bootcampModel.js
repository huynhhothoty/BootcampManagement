const mongoose = require('mongoose');

//
const semesterSchema = new mongoose.Schema({
    semester: {
        type: String,
        default: 'Semester 1',
    },
    subjectList: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
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
            default: true,
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
bootcampSchema.pre(/^find/, async function () {
    this.select('-createdAt -updatedAt -__v');
    //
});
bootcampSchema.pre('save', function () {
    this.populate('major');
    this.populate('author');
    this.populate('allocation');
    this.populate({
        path: 'detail',
        populate: { path: 'subjectList', model: 'Subject' },
    });
});
//
const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
module.exports = Bootcamp;
