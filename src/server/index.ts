import { Server } from './models/server';
import { Request, Response } from 'express';
import { ItemList } from './models/list';
import itemsRoute from './routes/items';
import { authRouter } from './routes/auth';

const server = new Server();

ItemList
    .initialize()
    .then(() => startServer())
    .catch((exception: Error) => console.log(`An exception occured: ${exception.toString()}`, exception));

function startServer() {
    server
        .initialize()
        .bindSocketIo()
        .addRoute(authRouter, '/user')
        .addRoute(itemsRoute(server.io.sockets), '/items')
        .addRoute(notFoundRouteHandler);
    console.log('Server started successfully');

    function notFoundRouteHandler(request: Request, response: Response) {
        return response
            .status(404)
            .sendFile('404.html', { root: __dirname });
    }
}
