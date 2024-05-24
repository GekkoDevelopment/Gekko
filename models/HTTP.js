import fetch from 'node-fetch';

export default class Http {
    /**
     * Performs a HTTP GET Request.
     * @param {string} url - The URL to which the GET request is sent.
     * @param {Object} [headers={}] - An object containing custom headers for the request. Defaults to an empty object if not provided.
     * @returns {Promise<any>} A Promise that resolves to the response data.
     */
    static async performGetRequest(url, headers = {}) {
        try {
            const options = {
                method: 'GET', // Set the HTTP method
                headers: headers // Set the custom headers
            };

            // Making the fetch request with the specified URL and options.
            const response = await fetch(url, options);

            // Returning the response object.
            return response;
        } catch (error) {
            // Log error
            console.error(`ERROR: ${error}`);
            throw error; // throw error
        }
    }


    /**
     * Performs an HTTP fetch request to the specified URL.
     * @param {string} url - The URL to which the request is sent.
     * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
     * @param {Object<string, string>} [headers={}] - Custom headers for the request. Optional.
     * @param {*} [data] - The data to be included in the request body. Optional.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @return {Promise<Response>} A Promise that resolves to the response object.
     */
    static async performPostRequest(url, headers, data, contentType = 'application/json') {
        try {
            // Constructing options object for the fetch request
            const options = {
                method: method, // Set the HTTP method
                headers: {
                    ...headers, // Spread the provided headers
                    'Content-Type': contentType // Set the Content-Type header
                },
                data: contentType === 'application/json' ? JSON.stringify(data) : data // Convert body to JSON string if contentType is application/json
            };

            // Only include the body if data is provided and method is not GET
            if (data !== undefined && method !== 'GET') {
                options.body = contentType === 'application/json' ? JSON.stringify(data) : data;
            }

            // Making the fetch request with the specified URL and options
            const response = await fetch(url, options);

            // Returning the response object
            return response;
        } catch (error) {
            // Handling errors
            console.error('Error:', error);
            throw error; // Rethrow the error
        }
    }

    /**
     * Performs an HTTP request with the specified method.
     * @param {string} url - The URL to which the request is sent.
     * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
     * @param {Object} [headers={}] - An object containing custom headers for the request. Defaults to an empty object if not provided.
     * @param {*} [body] - The data to be included in the request body. Defaults to `undefined` if not provided.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @returns {Promise<any>} A Promise that resolves to the response data.
     */
    static async performFetchRequest(url, method, headers = {}, body, contentType = 'application/json') {
        try {
            // Constructing options object for the fetch request
            const options = {
                method: method, // Set the HTTP method
                headers: {
                    ...headers, // Spread the provided headers
                    'Content-Type': contentType // Set the Content-Type header
                },
                body: body ? JSON.stringify(body) : undefined // Convert body to JSON string if provided, else set to undefined
            };
    
            // Making the fetch request with the specified URL and options
            const response = await fetch(url, options);
    
            // Parsing the response data as JSON
            const data = await response.json();
    
            // Returning the parsed response data
            return data;
        } catch (error) {
            // Handling errors
            console.error('Error:', error);
            throw error; // Rethrow the error
        }
    }
}
