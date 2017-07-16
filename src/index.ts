import 'whatwg-fetch';
import 'es6-promise/auto';

import Vue from 'vue';
import App from './app/app.vue';
import Auth from './app/auth/auth.vue';
import Items from './app/items/items.vue';
import Item from './app/items/item/item.vue';

// Fix for Webpack's require.context type issue
interface WebpackRequire extends NodeRequire {
  context(file: string, flag?: boolean, exp?: RegExp);
}

// Require all png files from assets
(require as WebpackRequire).context('./app/assets/', true, /^\.\/.*\.png/);

// Vue component registrations, binds html tags to components
// Components can also be registered under other components, so they are 'scoped'
Vue.component('auth', Auth);
Vue.component('items', Items);
Vue.component('item', Item);

const app = new Vue({
  el: '#app',
  components: { App, Auth, Items, Item },
  render(h: Function) {
    return h(App);
  }
});
