const mongoose = require('mongoose');

//

childSchema = new mongoose.Schema({
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
sectionSchema = new mongoose.Schema({
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
});
//
mainSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    detail: [sectionSchema],
});
// middleware

//
const Allocation = mongoose.model('Allocation', mainSchema);
module.exports = Allocation;
