export default class Router {

    private static navigateByUrl(url: string) {
        if (window.history && window.history.replaceState) {
            window.history.pushState({}, "", url);
        } else {
            window.location.pathname = url;
        }
    }

    static routes = {
        start: {
            url: '/'
        },
        list: {
            url: '/items'
        }
    }

    static get path() {
        return window.location.pathname;
    }

    static go(path: string) {
        return new Promise(resolve => {
            if (path !== Router.path) {
                Router.navigateByUrl(path);
            }
            resolve(path);
        })
    }
}