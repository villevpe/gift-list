import Vue from 'vue';
import sinonStubPromise from 'sinon-stub-promise';
import sinon from 'sinon';
import { expect, should } from 'chai';
import App from './app.vue';
import { ComponentOptions } from 'vue/types/options';
import { CreateElement } from 'vue/types/vue';

sinonStubPromise(sinon);

describe('App.vue', () => {
    let vm: Vue;

    before(() => {
        sinon.stub(window, 'fetch');
        window.fetch.returns(Promise.resolve(mockApiResponse(403, { message: 'Unauthorized' })));
        vm = initComponent();
    });

    it('Renders app name correctly', () => {
        expect(vm.$el.querySelector('h1').innerText).to.equal('Gift list');
    });

    it('Displays auth component if user has not logged in', () => {
        expect(vm.$el.querySelector('.auth')).not.to.equal(null);
    });

    it('Displays items component if user has logged in', (done) => {
        window.fetch.returns(Promise.resolve(mockApiResponse(200, { message: 'ok' })));
        vm = initComponent();
        
        window.setTimeout(() => {
            expect(vm.$el.querySelector('.auth')).to.equal(null);
            expect(vm.$el.querySelector('.items')).not.to.equal(null);
            done();
        },                0);
    });

    after(() => {
        window.fetch.restore();
    });

    function initComponent() {
        const stubAuthComponent = Vue.component('auth', {
            render: (h: CreateElement) => h('div', {
                // tslint:disable-next-line:object-literal-key-quotes
                'class': 'auth'
            })
        });
        const stubItemsComponent = Vue.component('items', {
            render: (h: CreateElement) => h('div', {
                // tslint:disable-next-line:object-literal-key-quotes
                'class': 'items'
            })
        });
        return new Vue({
            template: '<div></div>',
            components: { App, stubAuthComponent, stubItemsComponent },
            render(h: Function) {
                return h(App);
            }
        }).$mount();
    }

    function mockApiResponse(status: number = 200, body: object = {}) {
        return new window.Response(JSON.stringify(body), {
            status,
            headers: { 'Content-type': 'application/json' }
        });
    }
});