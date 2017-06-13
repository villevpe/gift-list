const express = require('express');
const app = express();
const auth = require('./routes/auth');
const session = require('express-session');
const gzipStatic = require("express-static-gzip");
const compression = require('compression');
const config = require('./config');
const List = require('./models/list');

List.ready().then(() => {
    const server = createServer();
    const io = require('socket.io').listen(server);
    extendRoutes();
    console.log("Server started successfully");

    function createServer() {
        return app
            .use(session(config.session))
            .use(compression(config.compression))
            .use('/', gzipStatic('dist'))
            .use('/user', auth.router)
            .listen(config.port);
    }

    function extendRoutes() {
        return app
            .use('/items', require('./routes/items')(io.sockets))
            .use((req, res) => res.status(404).sendFile('404.html', { root: __dirname }));
    }

}).catch(error => console.log("Error while creating list", error.toString()))

