module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: external "express"
var external__express_ = __webpack_require__(0);
var external__express__default = /*#__PURE__*/__webpack_require__.n(external__express_);

// EXTERNAL MODULE: external "express-session"
var external__express_session_ = __webpack_require__(3);
var external__express_session__default = /*#__PURE__*/__webpack_require__.n(external__express_session_);

// EXTERNAL MODULE: external "express-static-gzip"
var external__express_static_gzip_ = __webpack_require__(4);
var external__express_static_gzip__default = /*#__PURE__*/__webpack_require__.n(external__express_static_gzip_);

// EXTERNAL MODULE: external "compression"
var external__compression_ = __webpack_require__(5);
var external__compression__default = /*#__PURE__*/__webpack_require__.n(external__compression_);

// CONCATENATED MODULE: ./src/server/configuration/index.ts
var config = {
    port: process.env.PORT || 3000,
    session: {
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: false
        },
        name: '_sid',
        secret: '7214N-46X41-89H16',
        resave: true,
        saveUninitialized: true
    }
};
/* harmony default export */ var configuration = (config);

// EXTERNAL MODULE: external "socket.io"
var external__socket_io_ = __webpack_require__(6);
var external__socket_io__default = /*#__PURE__*/__webpack_require__.n(external__socket_io_);

// CONCATENATED MODULE: ./src/server/models/server.ts






var server_Server = /** @class */ (function () {
    function Server() {
        this.application = external__express_();
    }
    Server.prototype.initialize = function () {
        this.server = this.application
            .use(external__express_session_(configuration.session))
            .use(external__compression_({ filter: function (request, response) { return response.getHeader('Content-Encoding') !== 'gzip'; } }))
            .use('/', external__express_static_gzip_('dist')) // gzips only static files
            .listen(configuration.port);
        return this;
    };
    /**
     * Binds socket.io to express server
     */
    Server.prototype.bindSocketIo = function () {
        this.io = Object(external__socket_io_["listen"])(this.server);
        return this;
    };
    Server.prototype.addRoute = function (handler, path) {
        if (path) {
            this.application.use(path, handler);
        }
        else {
            this.application.use(handler);
        }
        return this;
    };
    return Server;
}());


// EXTERNAL MODULE: external "pg"
var external__pg_ = __webpack_require__(7);
var external__pg__default = /*#__PURE__*/__webpack_require__.n(external__pg_);

// EXTERNAL MODULE: external "pg-format"
var external__pg_format_ = __webpack_require__(8);
var external__pg_format__default = /*#__PURE__*/__webpack_require__.n(external__pg_format_);

// EXTERNAL MODULE: external "url"
var external__url_ = __webpack_require__(9);
var external__url__default = /*#__PURE__*/__webpack_require__.n(external__url_);

// CONCATENATED MODULE: ./src/server/models/storage.ts



var defaultContent = __webpack_require__(10);
var QUERIES = {
    CREATE_TABLE: "CREATE TABLE IF NOT EXISTS items(\n        id VARCHAR(10) PRIMARY KEY, \n        title VARCHAR(1024), \n        description TEXT, \n        url VARCHAR(2083), \n        reserved BOOLEAN, \n        token VARCHAR(15), \n        image VARCHAR(2083)\n    )",
    GET_ITEMS: "SELECT * FROM items  ORDER BY id ASC",
    SET_DEFAULT_ITEMS: "INSERT INTO items(id, image, title, description, url, token, reserved) VALUES %L",
    UPDATE_ITEM: "UPDATE items SET reserved=($1), token=($2) WHERE id=($3)"
};
var storage_Storage;
(function (Storage) {
    var pool;
    function createPool() {
        var poolConfiguration = getPoolConfig();
        pool = new external__pg_["Pool"](poolConfiguration);
        function getPoolConfig() {
            var urlParams = Object(external__url_["parse"])(process.env.DATABASE_URL);
            var auth = urlParams.auth ? urlParams.auth.split(':') : ['', ''];
            return {
                user: auth[0],
                password: auth[1],
                host: urlParams.hostname,
                port: +urlParams.port,
                database: urlParams.pathname.split('/')[1],
                ssl: !urlParams.hostname.includes('localhost')
            };
        }
    }
    function connect() {
        return new Promise(function (resolve, reject) {
            pool
                .connect(function (error, client, done) { return error ? reject(error) : resolve({ client: client, done: done }); });
        });
    }
    function init() {
        var _this = this;
        createPool();
        return new Promise(function (resolve, reject) {
            connect()
                .then(function (connection) {
                createTable()
                    .then(ensureTableHasData.bind(_this, connection))
                    .then(function () { return done(); })
                    .catch(function (exception) { return reject(exception); });
                function createTable() {
                    return connection
                        .client
                        .query(QUERIES.CREATE_TABLE);
                }
                function done() {
                    connection.done();
                    resolve();
                }
            })
                .catch(function (exception) { return reject(exception); });
        });
        function ensureTableHasData(connection) {
            return new Promise(function (resolve, reject) {
                getItems(connection)
                    .then(function (items) {
                    if (!items || items.length === 0) {
                        setDefaultItems(connection)
                            .then(function () { return resolve(); })
                            .catch(function (exception) { return reject(exception); });
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
    Storage.init = init;
    function setDefaultItems(connection) {
        var query = external__pg_format_(QUERIES.SET_DEFAULT_ITEMS, defaultContent
            .items
            .map(function (item) { return ([
            item.id,
            item.image.url,
            item.title,
            item.description,
            item.url,
            '',
            item.reserved,
        ]); }));
        return connection.client.query(query);
    }
    function getItems(openConnection) {
        if (openConnection === void 0) { openConnection = null; }
        return new Promise(function (resolve) {
            if (openConnection) {
                executeQuery(openConnection);
            }
            else {
                connect()
                    .then(function (newConnection) { return executeQuery(newConnection, true); });
            }
            function executeQuery(connection, endConnection) {
                if (endConnection === void 0) { endConnection = false; }
                return connection.client
                    .query(QUERIES.GET_ITEMS)
                    .then(function (results) {
                    if (endConnection) {
                        connection.done();
                    }
                    resolve(results.rows || []);
                });
            }
        });
    }
    Storage.getItems = getItems;
    function updateReservation(id, token, isReserved) {
        return new Promise(function (resolve, reject) {
            connect()
                .then(function (connection) {
                console.log("Updating item " + id + ", reserved=" + isReserved);
                connection
                    .client
                    .query(QUERIES.UPDATE_ITEM, [isReserved, token, id])
                    .then(function () {
                    connection.done();
                    resolve();
                });
            })
                .catch(function (exception) { return reject(exception); });
        });
    }
    Storage.updateReservation = updateReservation;
})(storage_Storage || (storage_Storage = {}));

// CONCATENATED MODULE: ./src/server/models/list.ts

var ERROR_CODES = {
    ALREADY_RESERVED: 'already_reserved',
    ALREADY_REMOVED: 'already_removed',
    TOKEN_OR_ID_MISSING: 'token_or_id_missing',
    TOKEN_RESERVED: 'token_reserved',
    WRONG_TOKEN: 'wrong_token',
};
var list_ItemList;
(function (ItemList) {
    ItemList.errors = ERROR_CODES;
    function initialize() {
        return storage_Storage.init();
    }
    ItemList.initialize = initialize;
    function reserve(id, token) {
        console.log("ITEMS: Trying to reserve " + id + " with token " + token);
        return new Promise(function (resolve, reject) {
            storage_Storage
                .getItems()
                .then(function (items) {
                if (itemIsAlreadyReserved()) {
                    reject(ERROR_CODES.ALREADY_RESERVED);
                }
                else {
                    var item = items.find(function (item) { return item.id === id; });
                    saveItem(item);
                }
                function itemIsAlreadyReserved() {
                    return items.find(function (item) { return item.id === id && item.reserved === true; });
                }
            });
            function saveItem(item) {
                if (item) {
                    storage_Storage
                        .updateReservation(id, token, true)
                        .then(function () {
                        storage_Storage.getItems()
                            .then(function (items) { return resolve({ item: item, items: items }); });
                    })
                        .catch(function (exception) { return reject(exception.toString()); });
                }
                else {
                    reject(ERROR_CODES.ALREADY_RESERVED);
                }
            }
        });
    }
    ItemList.reserve = reserve;
    function unreserve(id, token) {
        console.log("ITEMS: Trying to unreserve " + id + " with token " + token);
        return new Promise(function (resolve, reject) {
            storage_Storage
                .getItems()
                .then(function (items) {
                if (matchingItemExists()) {
                    unreserve();
                }
                else {
                    reject(ERROR_CODES.WRONG_TOKEN);
                }
                function matchingItemExists() {
                    return items.some(function (item) { return item.reserved && item.id === id && item.token === token; });
                }
                function unreserve() {
                    storage_Storage
                        .updateReservation(id, '', false)
                        .then(function () { return resolve(); })
                        .catch(function (exception) { return reject(exception.toString()); });
                }
            });
        });
    }
    ItemList.unreserve = unreserve;
    function getItems() {
        return storage_Storage.getItems();
    }
    ItemList.getItems = getItems;
})(list_ItemList || (list_ItemList = {}));

// EXTERNAL MODULE: external "body-parser"
var external__body_parser_ = __webpack_require__(1);
var external__body_parser__default = /*#__PURE__*/__webpack_require__.n(external__body_parser_);

// CONCATENATED MODULE: ./src/server/models/user.ts
var ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'demo';
var User;
(function (User) {
    function authenticate(password) {
        return password === ACCESS_TOKEN;
    }
    User.authenticate = authenticate;
})(User || (User = {}));

// CONCATENATED MODULE: ./src/server/routes/auth.ts



var router = external__express_["Router"]();
var auth_jsonParser = external__body_parser_["json"]();
router.post('/authenticated', auth_jsonParser, function (req, res) {
    if (req.session && req.session.authenticated) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(401);
    }
});
router.post('/login', auth_jsonParser, function (req, res) {
    processAuthentication(req)
        .then(function () { return res.sendStatus(200); })
        .catch(function (error) {
        console.log(error);
        res.sendStatus(401);
    });
});
function processAuthentication(request) {
    var password = request.body.p;
    return new Promise(function (resolve, reject) {
        if (typeof password === 'string' && User.authenticate(password)) {
            request.session.authenticated = true;
            resolve();
        }
        else {
            request.session.authenticated = false;
            reject();
        }
    });
}
var authRouter = router;
function authGuard(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    }
    else {
        console.log(req.session);
        res.sendStatus(401);
    }
}

// CONCATENATED MODULE: ./src/server/routes/items.ts




var LIST_UPDATED = 'list_update';
/* harmony default export */ var routes_items = (function (io) {
    var jsonParser = external__body_parser_["json"]();
    var reserve = function (req, res) { return processReservation(req, res, list_ItemList.reserve); };
    var unreserve = function (req, res) { return processReservation(req, res, list_ItemList.unreserve); };
    return external__express_["Router"]()
        .get('/', authGuard, getItems)
        .post('/reserve/:id', authGuard, jsonParser, reserve)
        .post('/unreserve/:id', authGuard, jsonParser, unreserve);
    function getItems(req, res) {
        list_ItemList
            .getItems()
            .then(function (results) { return res.send(results); })
            .catch(function (exception) { return sendErrorResponse(exception.toString(), res); });
    }
    function processReservation(request, response, action) {
        var token = validateToken(request.body.token);
        var id = request.params.id;
        if (!token || !id) {
            sendErrorResponse(list_ItemList.errors.TOKEN_OR_ID_MISSING, response);
        }
        else {
            action(id, token)
                .then(function () { return sendSuccessfulResponse(); })
                .catch(function (exception) {
                console.log(exception);
                sendErrorResponse(exception.message, response);
            });
        }
        function validateToken(rawToken) {
            return rawToken.slice(0, 15);
        }
        function sendSuccessfulResponse() {
            list_ItemList
                .getItems()
                .then(function (list) {
                io.emit(LIST_UPDATED, { items: list });
                response.sendStatus(200);
            });
        }
    }
    function sendErrorResponse(errorMessage, response) {
        response
            .status(500)
            .send({
            status: 500,
            message: errorMessage,
        });
    }
});;

// CONCATENATED MODULE: ./src/server/index.ts




var server = new server_Server();
list_ItemList
    .initialize()
    .then(function () { return startServer(); })
    .catch(function (exception) { return console.log("An exception occured: " + exception.toString(), exception); });
function startServer() {
    server
        .initialize()
        .bindSocketIo()
        .addRoute(authRouter, '/user')
        .addRoute(routes_items(server.io.sockets), '/items')
        .addRoute(notFoundRouteHandler);
    console.log('Server started successfully');
    function notFoundRouteHandler(request, response) {
        return response
            .status(404)
            .sendFile('404.html', { root: __dirname });
    }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express-static-gzip");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("pg");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("pg-format");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {"items":[{"id":"item_001","image":{"url":"./gift.png","title":"A Demo gift"},"title":"Demo gift 1","description":"A simple gift for testing purposes","url":"https://www.google.com","details":"","reserved":false},{"id":"item_002","image":{"url":"./gift.png","title":"A Demo gift"},"title":"Demo gift 2","description":"A simple gift for testing purposes","url":"https://www.google.com","details":"","reserved":false},{"id":"item_003","image":{"url":"./gift.png","title":"A Demo gift"},"title":"Demo gift 3","description":"A simple gift for testing purposes","url":"https://www.google.com","details":"","reserved":false}]}

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map