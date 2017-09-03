const sendRequest = (url: string, request: RequestInit) => {
    return new Promise((resolve, reject) => {
        let successful = true;
        fetch(url, request)
            .then(processResponse)
            .then((response: Response) => {
                if (successful) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => reject(error));

        function processResponse(rawResponse: Response) {
            successful = rawResponse.ok;
            const type = rawResponse.headers.get('Content-Type');
            return type.indexOf('json') > -1 ? rawResponse.json() : rawResponse.text();
        }
    });
};

export default class XHR {

    public static status = {
        ok: 200
    };
    // Type needs to be any, as this can be used to fetch multiple types of data
    // tslint:disable-next-line:no-any
    public static get(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const request: RequestInit = {
                method: 'GET',
                credentials: 'same-origin'
            };
            sendRequest(url, request)
                .then((data: {}) => resolve(data))
                .catch((error: Error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    /**
     * Perform post request with json data
     * @param url 
     * @param data 
     */
    public static post(url: string, data?: object, options?: object): Promise<{}> {
        return new Promise((resolve, reject) => {
            const request: RequestInit = {
                method: 'POST',
                credentials: 'same-origin', // session does not work properly if this is missing from requests
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: convertData(data),
            };
            if (options) {
                Object.assign(request, options);
            }
            sendRequest(url, request)
                .then((data: {}) => resolve(data))
                .catch((error: Error) => {
                    console.log(error);
                    reject(error);
                });

            function convertData(rawData: object) {
                return rawData ? JSON.stringify(rawData) : '';
            }
        });
    }
}