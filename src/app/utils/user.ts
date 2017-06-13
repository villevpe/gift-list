import xhr from '../utils/xhr';

class User {

    private _authenticated: boolean = false;

    public authenticated() {
        return xhr.post('/user/authenticated');
    }

    public login(password) {
        return xhr.post('/user/login', { p: password });
    }
}

const user = new User();
export default user;