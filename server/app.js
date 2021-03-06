const express = require('express');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/routes');

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log(`Successfully connected to database!`));

app.use(express.json());

app.use(routes);

module.exports = app;