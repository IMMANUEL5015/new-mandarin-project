const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log(`Successfully connected to database!`))
    .catch(err => {
        console.log(err.message);
        process.exit(1);
    });

module.exports = app;