// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

const { router: usersRouter } = require('./users/router')

app.use(express.static('public'));
app.use(morgan('common'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
})

// set up DB
// set up route to user endpoint
// add middleware to routes


app.get('/betsee/users/', usersRouter, (req, res) => {
    return res.json({
        data: 'This works'
    })
});

let server;
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}


app.listen(process.env.PORT || 8080);