const { Schema, model } = require('mongoose');

const teacherSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide teacher name'],
    },
    code: {
        type: String,
        required: [true, 'Please provide teacher code'],
    },
    departmentChild: {
        type: Schema.ObjectId,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const Teacher = model('Teacher', teacherSchema);

module.exports = Teacher;
