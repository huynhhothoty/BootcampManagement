const { model, Schema } = require('mongoose');

const departmentSchema = new Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    list: [
        {
            name: {
                type: String,
                default: 'Department Child',
            },
            code: {
                type: String,
                default: '10',
            },
        },
    ],
});

//
const Department = model('Department', departmentSchema);
module.exports = Department;
