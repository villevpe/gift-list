const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jsonParser = require('body-parser').json();

router.post('/authenticated', jsonParser, function (req, res) {
     if (req.session && req.session.authenticated) {
        res.sendStatus(200);
     } else {
        res.sendStatus(401);
     }
});


router.post('/login', jsonParser, function (req, res) {
    processAuthentication(req)
        .then(() =>  res.sendStatus(200))
        .catch(() => res.sendStatus(401))
});

function processAuthentication(request) {
    let password = request.body.p;
    return new Promise((resolve, reject) => {
        if (validFormat(password) && User.authenticate(password)) {
            request.session.authenticated = true;
            resolve();
        } else {
            request.session.authenticated = false;
            reject();
        }

        function validFormat(password) {
            return typeof password === "string"
        }
    });
}

function authGuard(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    router: router,
    guard: authGuard
};