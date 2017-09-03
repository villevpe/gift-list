const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'demo';

export module User {

    export function authenticate(password: string) {
        return password === ACCESS_TOKEN;
    }
}
