require('./config/config');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

// Parsing data from client
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// CORS
app.use(cors());

// Config endpoint employees
app.use(require('./routes/employee'));


// Public sources
app.use(express.static(path.resolve('public')))
app.use('/uploads', express.static(path.resolve('uploads')));

// Config database
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err, res) => {

    if (err) throw err;
    console.log('Database connected!');

});

// Listening request
app.listen(process.env.PORT, () => {
    console.log('Server on port: ', process.env.PORT);
});