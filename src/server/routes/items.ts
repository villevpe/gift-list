import * as express from 'express';
import * as parser from 'body-parser';
import { authGuard } from './auth';
import { ItemList, ReservationAction } from '../models/list';
import { Item } from '../models/storage';
const LIST_UPDATED = 'list_update';

export default (io: SocketIO.Namespace) => {
    const jsonParser = parser.json();
    const reserve = (req: express.Request, res: express.Response) => processReservation(req, res, ItemList.reserve);
    const unreserve = (req: express.Request, res: express.Response) => processReservation(req, res, ItemList.unreserve);
    return express
        .Router()
        .get('/', authGuard, getItems)
        .post('/reserve/:id', authGuard, jsonParser, reserve)
        .post('/unreserve/:id', authGuard, jsonParser, unreserve);

    function getItems(req: express.Request, res: express.Response) {
        ItemList
            .getItems()
            .then((results: Item[]) => res.send(results))
            .catch((exception: Error) => sendErrorResponse(exception.toString(), res));
    }

    function processReservation(request: express.Request, response: express.Response, action: ReservationAction) {
        const token = validateToken(request.body.token);
        const id = request.params.id;
        if (!token || !id) {
            sendErrorResponse(ItemList.errors.TOKEN_OR_ID_MISSING, response);
        } else {
            action(id, token)
                .then(() => sendSuccessfulResponse())
                .catch((exception: Error) => {
                    console.log(exception);
                    sendErrorResponse(exception.message, response);
                });
        }

        function validateToken(rawToken: string) {
            return rawToken.slice(0, 15);
        }

        function sendSuccessfulResponse() {
            ItemList
                .getItems()
                .then((list: Item[]) => {
                    io.emit(LIST_UPDATED, { items: list });
                    response.sendStatus(200);
                });
        }
    }

    function sendErrorResponse(errorMessage: string, response: express.Response) {
        response
            .status(500)
            .send({
                status: 500,
                message: errorMessage,
            });
    }
};
