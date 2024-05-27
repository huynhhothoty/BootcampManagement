const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
    {
        name: String,
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Who is owner of this draft?'],
        },
        data: {
            type: Object,
            required: [true, 'You need to save something!'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

//
draftSchema.pre(/^find/, function () {
    this.populate('author');
});
//
const Draft = mongoose.model('Draft', draftSchema);
module.exports = Draft;
