export default class XHR {

    public static status = {
        ok: 200
    };

    /**
     * Perform post request with json data
     * @param url 
     * @param data 
     */
    // tslint:disable-next-line:no-any
    public static post(url: string, data?: object, options?: object): Promise<any> {
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
            let successful = true;
            if (options) {
                Object.assign(request, options);
            }
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

            function convertData(rawData: object) {
                return rawData ? JSON.stringify(rawData) : '';
            }

            function processResponse(rawResponse: Response) {
                successful = rawResponse.ok;
                const type = rawResponse.headers.get('Content-Type');
                return type.indexOf('json') > -1 ? rawResponse.json() : rawResponse.text();
            }
        });
    }
}