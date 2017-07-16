const express = require('express');
const auth = require('./auth');
const jsonParser = require('body-parser').json();
const List = require('../models/list');

const router = express.Router();

/**
 * Route items and provide socket.io to all routes
 * @param {*} io socket.io instance
 */
function routeItems(io) {
    router
        .get('/', (req, res) => {
            res.redirect('../');
        })
        .post('/', auth.guard, (req, res) => {
            List
                .getList()
                .then(results => res.send(results));
        })
        .post('/reserve/:id', auth.guard, jsonParser, (req, res) => {
            processReservationAction(req, res, List.reserveItem);
        })
        .post('/unreserve/:id', auth.guard, jsonParser, (req, res) => {
            processReservationAction(req, res, List.unreserveItem);
        });

    function processReservationAction(req, res, action) {
        const token = validateToken(req.body.token);
        const id = req.params.id;
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
        return rawToken.slice(0, 15);
    }

    function failed(message, res) {
        res.status(500).send({
            status: 500,
            message,
        });
    }

    function updated(update, res) {
        io.emit('list_update', { items: update.items });
        res
            .status(200)
            .send({
                status: 200,
                message: update.item,
            });
    }

    return router;
}

module.exports = routeItems;
