const pg = require('pg');
const format = require('pg-format');
const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS items(id VARCHAR(10) PRIMARY KEY, title VARCHAR(1024), description TEXT, url VARCHAR(2083), reserved BOOLEAN, token VARCHAR(15), image VARCHAR(2083))';

let defaultContent = require('../content.json');

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