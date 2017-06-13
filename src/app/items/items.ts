import Vue from 'vue'
import Component from 'vue-class-component'
import xhr from '../utils/xhr'
import * as io from 'socket.io-client';
import { ItemService as Service, ItemData } from './items.service';

// Could be also used via definitelyTyped...
declare interface Socket {
    on(eventName: string, callback: Function): Function
}

const ERROR_CODES = {
    ALREADY_RESERVED: 'already_reserved',
    ALREADY_REMOVED: 'already_removed',
    TOKEN_OR_ID_MISSING: 'token_or_id_missing',
    TOKEN_RESERVED: 'token_reserved',
    WRONG_TOKEN: 'wrong_token'
};

const ERROR_MESSAGES = {
    ALREADY_RESERVED: 'Someone else just reserved this item. Please select another.',
    OTHER: 'An error occured, please try again',
    TOKEN_RESERVED: 'The password you have chosen is already in use. Please select another',
    WRONG_TOKEN: 'Wrong password'
};

const MODALS = {
    RESERVE: 'reserve',
    UNRESERVE: 'unreserve'
};

@Component
export default class Items extends Vue {
    items: ItemData[] = []
    activeItem: ItemData = null
    modals: object = MODALS
    private modal: string = null
    private token: string = ""
    private modalContentClickEvent: Event
    private reserveSuccess: boolean = false
    private reserveError: string = null
    private socket: Socket

    created() {
        this.load();
        this.bindSocketEvents();
    }

    updated() {
        if (this.modal) {
            let element = <HTMLInputElement>this.$refs.bookingInput;
            if (element) {
                element.focus();
            }
        }
    }

    bindSocketEvents() {
        this.socket = io();
        this.socket.on('list_update', data => {
            this.items = data.items;
        });
    }

    onCloseButtonClick() {
        this.modal = null;
    }

    onModalClick(event) {
        if (event !== this.modalContentClickEvent) {
            this.modal = null;
        }
    }

    onModalContentClick(event) {
        this.modalContentClickEvent = event;
    }

    onUnreserve(item) {
        this.reserveError = null;
        this.reserveSuccess = false;
        this.activeItem = item;
        this.modal = MODALS.UNRESERVE;
    }

    onReserve(item) {
        this.reserveError = null;
        this.reserveSuccess = false;
        this.activeItem = item;
        this.modal = MODALS.RESERVE;
    }

    onConfirmClick() {
        this.reserveError = null;
        this.reserveSuccess = false;
        let action = this.modal === MODALS.RESERVE ? Service.reserve : Service.unreserve;

        action(this.activeItem, this.token)
            .then(() => {
                this.reserveSuccess = true;
                this.load();
                setTimeout(() => this.modal = null, 1500);
            })
            .catch(error => {
                this.load();
                console.error(error.message ? error.message : error);
                if (error.message === ERROR_CODES.ALREADY_RESERVED) {
                    this.reserveError = ERROR_MESSAGES.ALREADY_RESERVED;
                } else if (error.message === ERROR_CODES.TOKEN_RESERVED) {
                    this.reserveError = ERROR_MESSAGES.TOKEN_RESERVED;
                } else if (error.message === ERROR_CODES.WRONG_TOKEN) {
                    this.reserveError = ERROR_MESSAGES.WRONG_TOKEN;
                } else {
                    this.reserveError = ERROR_MESSAGES.OTHER;
                }
            });
    }

    load() {
        return Service.getItems()
            .then(items =>   this.items = items)
            .catch(error => console.warn(error));
    }

}