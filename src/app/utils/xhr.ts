export default class XHR {

    public static status = {
        ok: 200
    };

    /**
     * Perform post request with json data
     * @param url 
     * @param data 
     */
    public static post(url: string, data?: object, options?: object) {
        return new Promise<any>((resolve, reject) => {
            let request = {
                method: 'POST',
                credentials: 'same-origin', // session does not work properly if this is missing from requests
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: convertData(data)
            };
            let successful = true;
            if (options) {
                Object.assign(request, options);
            }
            fetch(url, request)
                .then(processResponse)
                .then(response => {
                    if (successful) {
                        resolve(response)
                    } else {
                        reject(response);
                    }
                })
                .catch(error => reject(error));


            function convertData(rawData) {
                return rawData ? JSON.stringify(rawData) : '';
            }

            function processResponse(rawResponse) {
                successful = rawResponse.ok;
                const type = rawResponse.headers.get('Content-Type');
                return type.indexOf('json') > -1 ? rawResponse.json() : rawResponse.text();
            }
        });
    }
}