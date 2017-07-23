import Vue from 'vue';
import Component from 'vue-class-component';
import User from './utils/user';

@Component
export default class App extends Vue {
    appName: string = 'Gift list';
    authenticated: boolean = false;

    beforeCreate() {
        User.authenticated()
            .then(() => this.authenticated = true)
            .catch((excpetion: Error) => console.warn(excpetion));
    }

    onLogin() {
        this.authenticated = true;
    }
}