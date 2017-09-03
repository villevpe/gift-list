import * as express from 'express';
import * as session from 'express-session';
import { authRouter } from '../routes/auth';
import * as gzip from 'express-static-gzip';
import * as compression from 'compression';
import configuration from '../configuration';
import { listen } from 'socket.io';

export class Server {
    public application: express.Application;
    public server: {};

    public io: SocketIO.Server;

    constructor() {
        this.application = express();
    }

    initialize() {
        this.server = this.application
            .use(session(configuration.session))
            .use(compression({ filter: (request, response) => response.getHeader('Content-Encoding') !== 'gzip' }))
            .use('/', gzip('dist')) // gzips only static files
            .listen(configuration.port);
        return this;
    }

    /**
     * Binds socket.io to express server
     */
    bindSocketIo() {
        this.io = listen(this.server);
        return this;
    }

    addRoute(handler: express.RequestHandler, path?: string) {
        if (path) {
            this.application.use(path, handler);
        } else {
            this.application.use(handler);
        }
        return this;
    }
}