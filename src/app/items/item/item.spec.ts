import Vue from 'vue';
import sinonStubPromise from 'sinon-stub-promise';
import sinon from 'sinon';
import { expect, should } from 'chai';
import Item from './item.vue';
import { ComponentOptions } from 'vue/types/options';
import { CreateElement } from 'vue/types/vue';
import { ItemData } from '../items.service';

describe('Item.vue', () => {

    it('Displays item correctly', () => {
        const testItem: ItemData = {
            title: 'test',
            description: 'test',
            images: [],
            id: '0',
            details: 'test',
        };
        const Ctor = Vue.extend(<ComponentOptions<Vue>> Item);
        const vm = new Ctor({
            propsData: {
                item: testItem
            },
            render(h: Function) {
                return h(Item);
            }
        }).$mount();
        expect(vm.item).to.deep.equal(testItem);
    });

});