const express = require('express');
const router = express.Router();
const auth = require('./auth');
const jsonParser = require('body-parser').json();
const List = require('../models/list');

/**
 * Route items and provide socket.io to all routes
 * @param {*} io socket.io instance 
 */
function routeItems(io) {

    router
        .get('/', function (req, res) {
            res.redirect('../');
        })
        .post('/', auth.guard, function (req, res) {
            let data = List.getList().then(results => {
                res.send(results);
            });
        })
        .post('/reserve/:id', auth.guard, jsonParser, function (req, res) {
            processReservationAction(req, res, List.reserveItem);
        })
        .post('/unreserve/:id', auth.guard, jsonParser, function (req, res) {
            processReservationAction(req, res, List.unreserveItem);
        });

    function processReservationAction(req, res, action) {
        let token = validateToken(req.body.token);
        let id = req.params['id'];
        if (!token || !id) {
            failed(List.errors.TOKEN_OR_ID_MISSING, res);
        } else {
            try {
                action(id, token, response => updated(response, res), error => failed(error, res));
            } catch (exception) {
                failed(exception.message, res);
            }
        }
    }

    function validateToken(rawToken) {
        let _token = rawToken.slice(0, 15);
        return _token;
    }

    function failed(message, res) {
        res.status(500).send({
            status: 500,
            message: message
        });
    }

    function updated(update, res) {
        io.emit('list_update', { items: update.items });
        res.status(200).send({
            status: 200,
            message: update.item
        })
    }

    return router;
}

module.exports = routeItems;