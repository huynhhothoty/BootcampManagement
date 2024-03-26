const mongoose = require('mongoose');

//
const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subject must have a name'],
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
        branchMajor: {
            type: mongoose.Schema.ObjectId,
            ref: 'BranchMajor',
        },
        departmentChild: {
            type: mongoose.Schema.ObjectId,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
// middleware
subjectSchema.pre(/^find/, async function (next) {
    this.select('-createdAt -updatedAt -__v');
    this.populate([{ path: 'branchMajor' }]);
    //
});
subjectSchema.virtual('shortFormName').get(function () {
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

    return convert(this.name);
});
// subjectSchema.pre('save', function (next) {
//     const convert = (str) => {
//         let x = str;
//         const test = x.trim().split(' ');
//         let m = '';
//         if (test.length >= 4) {
//             for (let i = 0; i < 4; i++) {
//                 m += test[i][0];
//             }
//         } else {
//             let i = 0;
//             while (m.length < 4) {
//                 if (x[i] != ' ') m += x[i];
//                 i++;
//             }
//         }

//         return m.toUpperCase();
//     };
//     if (!this.shortFormName) {
//         const subName = this.name;
//         this.shortFormName = convert(subName);
//     }

//     next();
// });
//
const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
