import xhr from '../utils/xhr';

export declare interface ItemData {
    title: String;
    description: String;
    images: Object[];
    id: String;
    details: String;
}

export class ItemService {

    static getItems(): Promise<ItemData[]> {
        return xhr.post('/items');
    }

    static reserve(item: ItemData, reservationToken: string): Promise<{}> {
        return xhr.post('/items/reserve/' + item.id, { token: reservationToken });
    }

    static unreserve(item: ItemData, reservationToken: string): Promise<{}> {
        return xhr.post('/items/unreserve/' + item.id, { token: reservationToken });
    }
}