import Vue from 'vue';
import sinonStubPromise from 'sinon-stub-promise';
import sinon from 'sinon';
import { expect, should } from 'chai';
import Auth from './auth.vue';
import { ComponentOptions } from 'vue/types/options';
import { CreateElement } from 'vue/types/vue';
import User from '../utils/user';

sinonStubPromise(sinon);

describe('Auth.vue', () => {
    let vm: Vue;

    before(() => {
        sinon.stub(window, 'fetch');
        sinon.spy(User, 'login');
        window.fetch.returns(Promise.resolve(mockApiResponse()));
        vm = initComponent();
    });

    it('Sends login request with button click when code has a value', (done) => {
        const instance = vm.$children[0];
        instance.code = 'abc';
        instance.onContinueClick();
        instance.$nextTick(() => {
            // tslint:disable-next-line:no-unused-expression
            User.login.should.have.been.called;
            done();
        });
    });

    it('Input change clears error', () => {
        const instance = vm.$children[0];
        instance.error = true;

        instance.onInputChange();
        expect(instance.error).to.equal(false);
    });

    after(() => {
        window.fetch.restore();
        User.login.restore();
    });

    function initComponent() {

        return new Vue({
            template: '<div></div>',
            components: { Auth },
            render(h: Function) {
                return h(Auth);
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