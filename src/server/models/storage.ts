import { Pool, Client, QueryResult } from 'pg';
import * as format from 'pg-format';
import { parse } from 'url';
const defaultContent = require('../configuration/content.json');

const QUERIES = {
    CREATE_TABLE: `CREATE TABLE IF NOT EXISTS items(
        id VARCHAR(10) PRIMARY KEY, 
        title VARCHAR(1024), 
        description TEXT, 
        url VARCHAR(2083), 
        reserved BOOLEAN, 
        token VARCHAR(15), 
        image VARCHAR(2083)
    )`,
    GET_ITEMS: `SELECT * FROM items  ORDER BY id ASC`,
    SET_DEFAULT_ITEMS: `INSERT INTO items(id, image, title, description, url, token, reserved) VALUES %L`,
    UPDATE_ITEM: `UPDATE items SET reserved=($1), token=($2) WHERE id=($3)`
};

interface Connection {
    client: Client;
    done: Function;
}

export interface Item {
    id: string;
    token: string;
    url: string;
    reserved: boolean;
    image: string;
    title: string;
    description: string;
}

export module Storage {
    let pool: Pool;

    function createPool() {
        const poolConfiguration = getPoolConfig();
        pool = new Pool(poolConfiguration);

        function getPoolConfig() {
            const urlParams = parse(process.env.DATABASE_URL);
            const auth = urlParams.auth ? urlParams.auth.split(':') : ['', ''];
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

    function connect(): Promise<Connection> {
        return new Promise((resolve, reject) => {
            pool
                .connect((error, client: Client, done: Function) => error ? reject(error) : resolve({ client, done }));
        });
    }

    export function init() {
        createPool();
        return new Promise((resolve, reject) => {
            connect()
                .then((connection: Connection) => {
                    createTable()
                        .then(ensureTableHasData.bind(this, connection))
                        .then(() => done())
                        .catch((exception: Error) => reject(exception));

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
                .catch((exception: Error) => reject(exception));
        });

        function ensureTableHasData(connection: Connection) {
            return new Promise((resolve, reject) => {
                getItems(connection)
                    .then((items: Item[]) => {
                        if (!items || items.length === 0) {
                            setDefaultItems(connection)
                                .then(() => resolve())
                                .catch((exception: Error) => reject(exception));
                        } else {
                            resolve();
                        }
                    });
            });
        }
    }

    function setDefaultItems(connection: Connection): Promise<{}> {
        const query: string = format(
            QUERIES.SET_DEFAULT_ITEMS,
            defaultContent
                .items
                .map(item => ([
                    item.id,
                    item.image.url,
                    item.title,
                    item.description,
                    item.url,
                    '',
                    item.reserved,
                ]))
        );
        return connection.client.query(query);
    }

    export function getItems(openConnection: Connection = null): Promise<Item[]> {
        return new Promise((resolve) => {
            if (openConnection) {
                executeQuery(openConnection);
            } else {
                connect()
                    .then((newConnection: Connection) => executeQuery(newConnection, true));
            }

            function executeQuery(connection: Connection, endConnection: boolean = false) {
                return connection.client
                    .query(QUERIES.GET_ITEMS)
                    .then((results: QueryResult) => {
                        if (endConnection) {
                            connection.done();
                        }
                        resolve(results.rows || []);
                    });
            }
        });
    }

    export function updateReservation(id: string, token: string, isReserved: boolean) {
        return new Promise((resolve, reject) => {
            connect()
                .then((connection: Connection) => {
                    console.log(`Updating item ${id}, reserved=${isReserved}`);
                    connection
                        .client
                        .query(QUERIES.UPDATE_ITEM, [isReserved, token, id])
                        .then(() => {
                            connection.done();
                            resolve();
                        });
                })
                .catch((exception: Error) => reject(exception));
        });
    }
}
