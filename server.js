'use strict'
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const { PORT, DATABASE_URL} = require('./config');

const app = express();

const { router: usersRouter } = require('./users/router');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

app.use(express.static('public'));
app.use(morgan('common'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
})

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'this works'
    });
});

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

// connect auth
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
        mongoose.connect(DATABASE_URL, err => {
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
};

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };



// app.listen(process.env.PORT || 8080);