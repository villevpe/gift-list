import Vue from 'vue';
import Component from 'vue-class-component';
import User from '../utils/user';

@Component
export default class Auth extends Vue {
    code: string = '';
    error: boolean = false;

    onContinueClick() {
        if (this.code.length > 0) {
            User
                .login(this.code)
                .then(() => this.$emit('login', true))
                .catch((e: Error) => {
                    this.error = true;
                    console.warn(e);
                });
        }
    }

    onInputChange() {
        this.error = false;
    }

    onLabelClick(event: MouseEvent) {
        const element = <HTMLInputElement> (<HTMLElement> event.target).previousElementSibling;
        element.focus();
    }
}