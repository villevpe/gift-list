import Vue from 'vue';
import Component from 'vue-class-component';
import User from '../utils/user';
import Router from '../utils/router';

@Component
export default class Auth extends Vue {
    code: string=""
    error: boolean=false

    onContinueClick() {
        if (this.code.length > 0) {
            User.login(this.code)
            .then(() => {
                this.$emit('login', true)
            }).catch(e => {
                this.error = true;
                // todo: add warning ?
                console.warn(e);
            })
        }
    }

    onInputChange() {
        this.error = false;
    }

    onLabelClick(event) {
        let element = event.target.previousElementSibling;
        element.focus();
    }
}