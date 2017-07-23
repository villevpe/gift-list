const Storage = require('./storage');

const ERROR_CODES = {
    ALREADY_RESERVED: 'already_reserved',
    ALREADY_REMOVED: 'already_removed',
    TOKEN_OR_ID_MISSING: 'token_or_id_missing',
    TOKEN_RESERVED: 'token_reserved',
    WRONG_TOKEN: 'wrong_token',
};

class List {

    /**
     * Reference for errors
     * @returns {object} error codes
     */
    static get errors() {
        return ERROR_CODES;
    }

    static init() {
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
        console.log(`ITEMS: Trying to reserve ${id} with token ${token}`);
        Storage
            .get()
            .then((items) => {
                if (tokenIsReserved()) {
                    error(ERROR_CODES.TOKEN_RESERVED);
                } else {
                    saveItem();
                }

                function tokenIsReserved() {
                    return items.find(item => item.id === id && item.reserved === true);
                }

                function saveItem() {
                    const position = items.findIndex(item => item.id === id);
                    const item = items[position];
                    if (isUnreserved()) {
                        Storage
                            .updateReservation(id, token, true)
                            .then(newItems => success({ item, newItems }))
                            .catch(exception => error(exception.toString()));
                    } else {
                        error(ERROR_CODES.ALREADY_RESERVED);
                    }

                    function isUnreserved() {
                        return item && item.reserved === false;
                    }
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
        console.log(`ITEMS: Trying to unreserve ${id} with token ${token}`);
        Storage
            .get()
            .then((items) => {
                const itemIndex = findItemIndexByToken();
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
                        .then(newItems => success({ newItems }))
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
