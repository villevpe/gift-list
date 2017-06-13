declare var require: any;

import 'whatwg-fetch';
import 'es6-promise/auto';

import Vue from 'vue';
import App from './app/app.vue';
import Auth from './app/auth/auth.vue';
import Items from './app/items/items.vue';
import Item from './app/items/item/item.vue';
import Router from './app/utils/router';

// To support the types of vue.data and vue.computed, typings need to be defined as follows:
declare module 'vue/types/vue' {
  interface Vue {
    location: string
    view: Vue.Component
  }
}

// Require all png files from assets
require.context('./app/assets/', true, /^\.\/.*\.png/);

// Vue component registrations, binds html tags to components
// Components can also be registered under other components, so they are 'scoped'
Vue.component('auth', Auth);
Vue.component('items', Items);
Vue.component('item', Item);

const app = new Vue({
  el: '#app',
  components: { App, Auth, Items, Item },
  render(h) {
    return h(App)
  }
});
