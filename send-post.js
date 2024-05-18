import Http from "./models/HTTP.js";

(async () => {
    const url = 'https://kitsu.io/api/oauth/token';
    const headers = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
    }
    
    /*
    const body = {
        grant_type: 'password',
        username: '<email|slug>',
        password: '<password>'
    };
    */

    const body = {
        grant_type: 'refresh_token',
        refresh_token: '<refresh_token>'
    }
    
    try {
        const response = await Http.performHttpPostRequest(url, headers, 'application/json', body);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
})();