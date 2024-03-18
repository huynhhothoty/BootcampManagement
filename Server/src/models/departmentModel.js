const { model, Schema } = require('mongoose');

const departmentSchema = new Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
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
const departmentModel = model('Department', departmentSchema);
module.exports = {
    departmentModel,
};
