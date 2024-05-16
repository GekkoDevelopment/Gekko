import fetch from "node-fetch";

export class HTTP {
    /**
     * Performs a HTTP GET Request.
     * @param {string} url - The URL to which the GET request is sent.
     * @param {Object} [headers={}] - An object containing custom headers for the request. Defaults to an empty object if not provided.
     * @returns {Promise<any>} A Promise that resolves to the response data.
     */
    static async performHttpGetRequest(url, headers = {}) {
        try {
            // Making the HTTP GET request with the specified URL and headers
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
    
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
     * Performs a HTTP POST Request.
     * @param {string} url - The URL to which the POST request is sent.
     * @param {Object} [headers={}] - An object containing custom headers for the request. Defaults to an empty object if not provided. 
     * @param {*} [body] - The data to be included in the request body. Defaults to `undefined` if not provided.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @returns {Promise<any>} - A Promise that resolves to the response data.
     */
    static async performHttpPostRequest(url, headers, body, contentType = 'application/json') {
        try {
            // Making the HTTP POST request with the specified URL, headers, and body
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...headers, // Spread the provided headers
                    'Content-Type': contentType // Set the Content-Type header
                },
                body: body // Include the request body
            });
    
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
     * Fetches data from the specified URL using HTTP GET request.
     * @param {string} url - The URL from which data is to be fetched.
     * @param {Object<string, string>} headers - Custom headers for the request.
     * @param {string} accessToken - The access token for authorization.
     * @param {string} [contentType='application/json'] - The content type of the request body. Defaults to 'application/json' if not provided.
     * @return {Promise<void>} A Promise that resolves once data is fetched and logged.
     */
    static async fetchData(url, headers, accessToken, contentType = "application/json") {
        const url = url;
        const headers = {
            'Content-Type:': contentType,
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            // Get the data from a data using a GET request
            const data = await this.performHttpGetRequest(url, headers);
            console.log('Response: ', data); // Log response data
        } catch (error) {
            console.error('Error: ', error); // Log a console error.
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
    static async performHttpFetchRequest(url, method, headers = {}, body, contentType = 'application/json') {
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