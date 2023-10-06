const mongoose = require('mongoose');

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
            default:
                'This is a description of a major, you can custom this field',
        },
    },
    {
        timestamps: true,
    }
);
//
majorSchema.pre(/^find/, function () {
    this.select('-createdAt -updatedAt -__v');
});
//
const Major = mongoose.model('Major', majorSchema);
module.exports = Major;
