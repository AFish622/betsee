// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

const { router: usersRouter } = require('./users/router')

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/betsee/users/', usersRouter);


app.listen(process.env.PORT || 8080);