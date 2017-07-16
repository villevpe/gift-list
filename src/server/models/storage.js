const pg = require('pg');
const format = require('pg-format');
const url = require('url');
const defaultContent = require('../content.json');

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS items(
    id VARCHAR(10) PRIMARY KEY, 
    title VARCHAR(1024), 
    description TEXT, 
    url VARCHAR(2083), 
    reserved BOOLEAN, 
    token VARCHAR(15), 
    image VARCHAR(2083)
)`;

const urlParams = url.parse(process.env.DATABASE_URL || 'postgres://localhost:5432');
const auth = urlParams.auth ? urlParams.auth.split(':') : false;

const pool = new pg.Pool(process.env.DATABASE_URL ?
    {
        user: auth[0],
        password: auth[1],
        host: urlParams.hostname,
        port: urlParams.port,
        database: urlParams.pathname.split('/')[1],
        ssl: true
    } :
    {
        host: urlParams.hostname,
        port: urlParams.port,
        ssl: false
    }
);

class Storage {

    static connect() {
        return new Promise((resolve, reject) => {
            pool
                .connect((error, client, done) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ client, done });
                    }
                });
        });
    }

    static init() {
        return new Promise((resolve, reject) => {
            Storage
                .connect()
                .then((connection) => {
                    connection
                        .client
                        .query(CREATE_TABLE, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                const items = [];
                                const query = connection.client.query('SELECT * FROM items');
                                query.on('row', row => items.push(row));
                                query.on('end', () => {
                                    if (items.length === 0) {
                                        console.log('ITEMS: Inserting default data');
                                        connection
                                            .client
                                            .query(getQuery(), (insertError, result) => {
                                                connection.done();
                                                if (insertError) {
                                                    reject(insertError);
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
                });

            function getQuery() {
                const values = defaultContent.items.map(item => ([
                    item.id,
                    item.image.url,
                    item.title,
                    item.description,
                    item.url,
                    '',
                    item.reserved,
                ]));
                return format(
                    'INSERT INTO items(id, image, title, description, url, token, reserved) VALUES %L',
                    values
                );
            }
        });
    }

    static get() {
        return new Promise((resolve, reject) => {
            Storage
                .connect()
                .then((connection) => {
                    const results = [];
                    const query = connection.client.query('SELECT * FROM items ORDER BY id ASC');
                    query.on('row', row => results.push(row));
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
                .then((connection) => {
                    const items = [];
                    console.log('Saving item ', id, token, status);
                    connection.client.query(
                        'UPDATE items SET reserved=($1), token=($2) WHERE id=($3)',
                        [status, token, id]
                    );
                    const query = connection.client.query('SELECT * FROM items ORDER BY id ASC');
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
