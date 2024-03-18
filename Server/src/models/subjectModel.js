const mongoose = require('mongoose');

//
const subjectSchema = new mongoose.Schema(
    {
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
                message:
                    'type of subject must be one of those: general, foundation, major',
            },
            required: [true, 'subject must have one of type'],
        },
        prerequisite: {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject',
        },
        major: {
            type: mongoose.Schema.ObjectId,
            ref: 'Major',
        },
        branchMajor: {
            type: mongoose.Schema.ObjectId,
            ref: 'BranchMajor',
        },
        department: {
            type: mongoose.Schema.ObjectId,
            ref: 'Department',
        },

        departmentChild: {
            type: mongoose.Schema.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);
// middleware
subjectSchema.pre(/^find/, function () {
    this.select('-createdAt -updatedAt -__v');
    this.populate([{ path: 'branchMajor' }, { path: 'department' }, { path: 'major' }]);
});
subjectSchema.pre('save', function (next) {
    const convert = (str) => {
        let x = str;
        const test = x.trim().split(' ');
        let m = '';
        if (test.length >= 4) {
            for (let i = 0; i < 4; i++) {
                m += test[i][0];
            }
        } else {
            let i = 0;
            while (m.length < 4) {
                if (x[i] != ' ') m += x[i];
                i++;
            }
        }

        return m.toUpperCase();
    };
    if (!this.shortFormName) {
        const subName = this.name;
        this.shortFormName = convert(subName);
    }

    next();
});
//
const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
