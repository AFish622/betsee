'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const { User } = require('./models');

router.get('/', bodyParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => {
        return !(field in req.body);
    })

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing Field',
            location: missingField
        });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(field => {
        return field in req.body && typeof req.body[field] !== 'string'
    });

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Inccorect field type: expected string',
            location: nonStringField
        });
    };

    const explicitlyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(field => {
        return req.body[field].trim() !== req.body[field]
    });

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'cannot start or end with whitespace',
            location: nonTrimmedField
        });
    };

    const sizedFields = {
        username: {
            min: 3
        },
        password: {
            min: 7,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(field => {
        return 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[fields].min
    });

    const tooLargeField = Object.keys(sizedFields).find(field => {
        return 'max' in sizedFields[field].trim().length > sizedFields[field].max
    });

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: tooSmallField 
                            ? `Must be at least ${sizeFields[tooSmallField].min} characters long`
                            : `Must be at most ${sizedFields[tooLargeField].max} characters long` 
        });
    }

    let { username, password, firstName = '', lastName = '' } = req.body;
    
    firstName = firstName.trim();
    lastName = lastName.trim();

    return User.find({username})
                    .count()
                    .then(count => {
                        if (count > 0) {
                            return Promise.reject({
                                code: 422,
                                reason: 'ValidationError',
                                message: 'Username already taken',
                                location: 'username'
                            });
                        }
                        return User.hashPassword(password);
                    })
                    .then(hash => {
                        return User.create({
                            username,
                            password: hash,
                            firstName,
                            lastName
                        });
                    })
                    .then(user => {
                        return res.status(201).json(user.serialize());
                    })
                    .catch(error => {
                        if (error.reason == 'ValidationErorr') {
                            return res.status(err.code).json(err);
                        }
                        res.status(500).json({code: 500, message: 'Internal server error'});
                    });
});

router.get('/', (req, res) => {
    return User.find()
                    .then(users => {
                        res.json(users.map(user => {
                            user.serialize();
                        }))
                    })
                    .catch(error => {
                        res.status(500).json({message: 'Internal server error'});
                    })
});

module.exports = { router };