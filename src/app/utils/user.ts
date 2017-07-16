import xhr from '../utils/xhr';

export default class User {

    public static authenticated() {
        return xhr.post('/user/authenticated');
    }

    public static login(password: string) {
        return xhr.post('/user/login', { p: password });
    }
}