import fetch from 'node-fetch';
import qs from 'qs';

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
     * Performs an HTTP POST request to the specified URL.
     * @param {string} url - The URL to which the request is sent.
     * @param {Object<string, string>} [headers={}] - Custom headers for the request. Optional.
     * @param {*} [body] - The data to be included in the request body. Optional.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @return {Promise<Response>} A Promise that resolves to the response object.
     */
    static async performPostRequest(url, headers = {}, body, contentType = 'application/json') {
        try {
            const options = {
                method: 'POST', // Set the HTTP method to POST
                headers: {
                    ...headers, // Spread the provided headers
                    'Content-Type': contentType // Set the Content-Type header
                },
                body: contentType === 'application/json' ? JSON.stringify(body) : qs.stringify(body) // Convert body to URL-encoded string if contentType is application/x-www-form-urlencoded
            };

            if (body !== undefined) {
                options.body = contentType === 'application/json' ? JSON.stringify(body) : qs.stringify(body);
            }

            // Adding a timeout to the fetch request to handle pending status
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId); // Clear the timeout if request completes

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Request timed out');
            } else {
                console.error('Error:', error);
            }
            throw error;
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

    /**
     * Performs an HTTP PUT request to the specified URL.
     * @param {string} url - The URL to which the PUT request is sent.
     * @param {Object<string, string>} headers - Custom headers for the request.
     * @param {*} [data] - The data to be included in the request body. Optional.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @return {Promise<Response>} A Promise that resolves to the response object.
     */
    static async performPutRequest(url, headers, data, contentType = 'application/json') {
        try {
            // Constructing options object for the fetch request
            const options = {
                method: 'PUT', // Set the HTTP method to PUT
                headers: {
                    ...headers, // Spread the provided headers
                    'Content-Type': contentType // Set the Content-Type header
                }
            };

            // Only include the body if data is provided
            if (data !== undefined) {
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
}
