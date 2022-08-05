class Http {
    ajax = (config) => {

        let _config = {
            method: config.method,
            url: config.url,
            async: config.async
        };

        const REQUEST = new XMLHttpRequest();

        return new Promise((resolve, reject) => {

            REQUEST.onload = () => {
                if (REQUEST.status === 200) {
                    resolve(REQUEST);
                } else {
                    reject({
                        status: REQUEST.status,
                        statusText: REQUEST.statusText
                    });
                }
            }

            REQUEST.open(_config.method, _config.url, _config.async);
            REQUEST.send();
        });
    }
}