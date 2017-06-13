import xhr from '../utils/xhr';

export declare interface ItemData {
    title: String
    description: String
    images: Object[]
    id: String
    details: String
}

export class ItemService {

    /**
     * @returns Promise<any>
     */
    static getItems() {
        return xhr.post('/items');
    }

    static reserve(item, reservationToken) {
        return xhr.post('/items/reserve/' + item.id, {token: reservationToken});
    }

    static unreserve(item, reservationToken) {
         return xhr.post('/items/unreserve/' + item.id, {token: reservationToken});
    }
}