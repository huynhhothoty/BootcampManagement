const mongoose = require('mongoose');

//
const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subject must have a name'],
        },
        subjectCode: {
            type: String,
            required: [true, 'Subject must have a code'],
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
                message:
                    'type of subject must be one of those: general, foundation, major',
            },
            required: [true, 'subject must have one of type'],
        },
        branchMajor: {
            type: mongoose.Schema.ObjectId,
            ref: 'BranchMajor',
        },
    },
    {
        timestamps: true,
    }
);
// middleware
subjectSchema.pre(/^find/, function () {
    this.select('-createdAt -updatedAt -__v');
});
//
const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
