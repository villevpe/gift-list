import { Storage, Item } from './storage';

const ERROR_CODES = {
    ALREADY_RESERVED: 'already_reserved',
    ALREADY_REMOVED: 'already_removed',
    TOKEN_OR_ID_MISSING: 'token_or_id_missing',
    TOKEN_RESERVED: 'token_reserved',
    WRONG_TOKEN: 'wrong_token',
};
export type ReservationAction = (...args: {}[]) => Promise<{}>;
export module ItemList {
    export const errors = ERROR_CODES;

    export function initialize() {
        return Storage.init();
    }

    export function reserve(id: string, token: string): Promise<{}> {
        console.log(`ITEMS: Trying to reserve ${id} with token ${token}`);
        return new Promise((resolve, reject) => {
            Storage
                .getItems()
                .then((items: Item[]) => {
                    if (itemIsAlreadyReserved()) {
                        reject(ERROR_CODES.ALREADY_RESERVED);
                    } else {
                        const item = items.find((item: Item) => item.id === id);
                        saveItem(item);
                    }

                    function itemIsAlreadyReserved() {
                        return items.find(item => item.id === id && item.reserved === true);
                    }
                });

            function saveItem(item: Item) {
                if (item) {
                    Storage
                        .updateReservation(id, token, true)
                        .then(() => {
                            Storage.getItems()
                                .then((items: Item[]) => resolve({ item, items }));
                        })
                        .catch(exception => reject(exception.toString()));
                } else {
                    reject(ERROR_CODES.ALREADY_RESERVED);
                }
            }
        });
    }

    export function unreserve(id: string, token: string): Promise<{}> {
        console.log(`ITEMS: Trying to unreserve ${id} with token ${token}`);
        return new Promise((resolve, reject) => {
            Storage
                .getItems()
                .then((items: Item[]) => {
                    if (matchingItemExists()) {
                        unreserve();
                    } else {
                        reject(ERROR_CODES.WRONG_TOKEN);
                    }

                    function matchingItemExists() {
                        return items.some((item: Item) => item.reserved && item.id === id && item.token === token);
                    }

                    function unreserve() {
                        Storage
                            .updateReservation(id, '', false)
                            .then(() => resolve())
                            .catch((exception: Error) => reject(exception.toString()));
                    }
                });
        });
    }

    export function getItems() {
        return Storage.getItems();
    }
}
