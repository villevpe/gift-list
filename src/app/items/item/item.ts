import Vue from 'vue';
import Component from 'vue-class-component';
import { ItemService as Service, ItemData } from '../items.service';

@Component({
    props: {
        item: null
    }
})
export default class Item extends Vue {
    item: ItemData;

    onReserveButtonClick() {
        this.$emit('reserve', this.item);
    }

    onUnreserveButtonClick() {
        this.$emit('unreserve', this.item);
    }

}