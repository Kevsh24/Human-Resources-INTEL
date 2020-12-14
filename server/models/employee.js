const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let employeeSchema = new Schema({

    id: {
        type: String,
        unique: true,
        require: [true, 'Id is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    picture: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    hireDate: {
        type: Date,
        required: [true, 'Hire date number is required']
    },
    managerId: {
        type: String,
        require: [true, 'Manager id is required']
    },
});

employeeSchema.plugin(uniqueValidator, { message: '{PATH} should be unique.' });

module.exports = mongoose.model('Employee', employeeSchema);