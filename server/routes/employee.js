const express = require('express');
const _ = require('underscore');
const Employee = require('../models/employee');
const multer = require('../libs/multer');
const path = require('path');
const fs = require('fs-extra');

const app = express();

app.get('/employee', function(req, res) {

    // Maybe you want pagination
    let init = req.query.init || 0;
    init = Number(init);

    let final = req.query.final || 10;
    final = Number(final);

    // For searching
    let value = req.query.value || "";

    Employee.find({ $or: [{ id: { $regex: value } }, { name: { $regex: value } }] })
        .skip(init)
        .limit(final)
        .sort({ 'name': 1 })
        .exec((err, employees) => {

            if (err) {
                return res.status(400).json({
                    err
                });
            }

            Employee.countDocuments((err, count) => {
                res.json({
                    employees,
                    count
                });
            });
        });

});

app.post('/photo', multer.single('image'), function(req, res) {

    res.json({
        ok: 'Its ok!'
    });
});

app.post('/employee', multer.single('image'), function(req, res) {

    let { id, name, phoneNumber, email, hireDate, managerId } = req.body;

    let employee = new Employee({
        id,
        name,
        picture: req.file.path,
        phoneNumber,
        email,
        hireDate,
        managerId
    });

    employee.save((err, newEmployee) => {

        if (err) {
            return res.status(400).json({
                err
            });
        }

        res.json({
            employee: newEmployee
        });
    });

});

app.put('/employee/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['id', 'name', 'picture', 'hireDate', 'phoneNumber', 'email', 'managerId']);

    Employee.findByIdAndUpdate(id, body, { new: true }, (err, newEmployee) => {

        if (err) {
            return res.status(400).json({
                err
            });
        }

        res.json({
            employee: newEmployee
        });
    })

});

app.delete('/employee/:id', function(req, res) {

    let id = req.params.id;

    Employee.findByIdAndRemove(id, (err, deletedEmployee) => {

        if (err) {
            return res.status(400).json({
                err
            });
        };

        if (!deletedEmployee) {
            return res.status(400).json({
                err: {
                    message: 'Employee not found!'
                }
            });
        }

        //Deletes local image
        fs.unlink(path.resolve(deletedEmployee.picture));

        res.json({
            deletedEmployee
        });
    });

});


module.exports = app;