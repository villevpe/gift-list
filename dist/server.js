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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Storage = __webpack_require__(12);

const ERROR_CODES = {
    ALREADY_RESERVED: 'already_reserved',
    ALREADY_REMOVED: 'already_removed',
    TOKEN_OR_ID_MISSING: 'token_or_id_missing',
    TOKEN_RESERVED: 'token_reserved',
    WRONG_TOKEN: 'wrong_token'
};

class List {

    /**
     * Reference for errors
     * @returns {object} error codes
     */
    static get errors() {
        return ERROR_CODES;
    }

    static ready() {
        return Storage.init();
    }

    /**
     * Reserves item and saves list
     * @param {string} id 
     * @param {string} token 
     * @param {function} success 
     * @param {function} error 
     */
    static reserveItem(id, token, success, error) {
        console.log("ITEMS: Trying to reserve " + id + " with token " + token);
        Storage.get().then(items => {
            if (tokenIsReserved(items)) {
                error(ERROR_CODES.TOKEN_RESERVED);
            } else {
                saveItem();
            }

            function saveItem() {
                let position = items.findIndex(item => item.id === id);
                let item = items[position];
                if (isUnreserved()) {
                    Storage
                        .updateReservation(id, token, true)
                        .then(items => success({ item: item, items: items }))
                        .catch(exception => error(exception.toString()));

                } else {
                    error(ERROR_CODES.ALREADY_RESERVED);
                }

                function isUnreserved() {
                    return item && item.reserved === false;
                }
            }

            function tokenIsReserved(items) {
                return items.find(item => item.id === id && item.reserved === true);
            }
        });
    }

    /**
     * Unreserves item and saves list
     * @param {string} id 
     * @param {string} token 
     * @param {function} success 
     * @param {function} error 
     */
    static unreserveItem(id, token, success, error) {
        console.log("ITEMS: Trying to unreserve " + id + " with token " + token);
        Storage.get().then(items => {
            let itemIndex = findItemIndexByToken();
            if (itemIndex > -1) {
                unreserve();
            } else {
                error(ERROR_CODES.WRONG_TOKEN);
            }

            function findItemIndexByToken() {
                return items.findIndex(item => item.id === id && item.reserved === true && item.token === token);
            }

            function unreserve() {
                Storage
                    .updateReservation(id, '', false)
                    .then(items => success({ items: items }))
                    .catch(exception => error(exception.toString()));
            }
        });

    }

    /**
     * @returns {Promise<Object>} list of items
     */
    static getList() {
        return Storage.get();
    }
}

module.exports = List;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(0);
const User = __webpack_require__(13);
const router = express.Router();
const jsonParser = __webpack_require__(4).json();

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const compression = __webpack_require__(3);

const config = {
    compression: { 
        filter: compressOnlyUncompressed 
    },
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

function compressOnlyUncompressed(req, res) {
    if (res.getHeader('Content-Encoding') === 'gzip') {
        return false;
    }
    return compression.filter(req, res);
}


module.exports = config;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(0);
const router = express.Router();
const auth = __webpack_require__(2);
const jsonParser = __webpack_require__(4).json();
const List = __webpack_require__(1);

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

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express-static-gzip");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
	"items": [
		{
			"id": "item_001",
			"image": {
				"url": "./gift.png",
				"title": "A Demo gift"
			},
			"title": "Demo gift 1",
			"description": "A simple gift for testing purposes",
			"url": "https://www.google.com",
			"details": "",
			"reserved": false
		},
		{
			"id": "item_002",
			"image": {
				"url": "./gift.png",
				"title": "A Demo gift"
			},
			"title": "Demo gift 2",
			"description": "A simple gift for testing purposes",
			"url": "https://www.google.com",
			"details": "",
			"reserved": false
		},
		{
			"id": "item_003",
			"image": {
				"url": "./gift.png",
				"title": "A Demo gift"
			},
			"title": "Demo gift 3",
			"description": "A simple gift for testing purposes",
			"url": "https://www.google.com",
			"details": "",
			"reserved": false
		}
	]
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(0);
const app = express();
const auth = __webpack_require__(2);
const session = __webpack_require__(7);
const gzipStatic = __webpack_require__(8);
const compression = __webpack_require__(3);
const config = __webpack_require__(5);
const List = __webpack_require__(1);

List.ready().then(() => {
    const server = createServer();
    const io = __webpack_require__(9).listen(server);
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
            .use('/items', __webpack_require__(6)(io.sockets))
            .use((req, res) => res.status(404).sendFile('404.html', { root: __dirname }));
    }

}).catch(error => console.log("Error while creating list", error.toString()))



/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const pg = __webpack_require__(14);
const format = __webpack_require__(15);
const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS items(id VARCHAR(10) PRIMARY KEY, title VARCHAR(1024), description TEXT, url VARCHAR(2083), reserved BOOLEAN, token VARCHAR(15), image VARCHAR(2083))';

let defaultContent = __webpack_require__(10);

class Storage {
    constructor() {
        if (process.env.DATABASE_URL) {
            pg.defaults.ssl = true;
        }
    }

    static connect() {
        return new Promise((resolve, reject) => {
            pg.connect(process.env.DATABASE_URL || 'postgres://localhost:5432', (error, client, done) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ client: client, done: done });
                }
            });
        })
    }

    static init(callback) {
        return new Promise((resolve, reject) => {
            Storage.connect().then(connection => {
                connection.client.query(CREATE_TABLE, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        let items = [];
                        let query = connection.client.query('SELECT * FROM items');
                        query.on('row', row => items.push(row));
                        query.on('end', () => {
                            if (items.length === 0) {
                                console.log("ITEMS: Inserting default data");
                                let query = getQuery();
                                connection.client.query(query, (error, result) => {
                                    connection.done();
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            } else {
                                connection.done();
                                resolve();
                            }
                        });
                    }
                });
            })

            function getQuery() {
                let values = defaultContent.items.map(item => ([
                    item.id,
                    item.image.url,
                    item.title,
                    item.description,
                    item.url,
                    '',
                    item.reserved
                ]));
                return format('INSERT INTO items(id, image, title, description, url, token, reserved) VALUES %L', values);
            }
        })
    }

    static get() {
        return new Promise((resolve, reject) => {
            Storage.connect()
                .then((connection) => {
                    let results = [];
                    let query = connection.client.query('SELECT * FROM items ORDER BY id ASC');
                    query.on('row', (row) => results.push(row));
                    query.on('end', () => {
                        connection.done();
                        resolve(results);
                    });
                })
                .catch(error => reject(error));
        });
    }

    static updateReservation(id, token, status) {
        return new Promise((resolve, reject) => {
            Storage.connect()
                .then(connection => {
                    let items = [];
                    console.log("Saving item ", id, token, status);
                    connection.client.query('UPDATE items SET reserved=($1), token=($2) WHERE id=($3)', [status, token, id]);
                    let query = connection.client.query('SELECT * FROM items ORDER BY id ASC');
                    query.on('row', row => items.push(row));
                    query.on('end', () => {
                        connection.done();
                        resolve(items);
                    });

                })
                .catch(error => reject(error));
        });
    }
}

module.exports = Storage;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "demo";

class User {

    static authenticate(password) {
        return password === ACCESS_TOKEN;
    }
}

module.exports = User;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("pg");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("pg-format");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map