const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.ObjectId,
            required: [true, 'Who is owner of this draft?'],
        },
        data: {
            type: Object,
            required: [true, 'You need to save something!'],
        },
    },
    {
        timestamps: true,
    }
);

//
draftSchema.pre(/^find/, function () {
    this.select('-__v -createdAt -updatedAt');
});
//
const Draft = mongoose.model('Draft', draftSchema);
module.exports = Draft;
