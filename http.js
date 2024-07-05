// a file just to get information and perform http requests without running commands on discord.
import Http from "./models/HTTP.js";
import dotenv from 'dotenv';

dotenv.config();
/*
try {
    const animeName = ''
    const headers = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
    };
    
    const option = await Http.performGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
    const data = await option.json();
    
} catch (error) {
    console.error(error);
}
*/

try {
    
} catch (error) {
    console.error(error);
}

function perodicallyPostRequest(url, headers, body, contentType, interval) {
    setInterval(async () => {
        const data = await Http.performPostRequest(url, headers, body, contentType);
        const expiresTime = data.expires_in;
    }, interval);
}

function perodicallyRefreshToken(refreshToken, interval) {
    setInterval(() => {
        try {
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            const body = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            };

            const data = Http.performPostRequest('https://kitsu.io/api/oauth/token', headers, body, 'application/x-www-form-urlencoded');
            const accessToken = data.access_token;
        }
        catch (error) {
            console.log(error);
        }
    }, interval);
}

/*
KITSU_ID=dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd
KITSU_SECRET=54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151
KITSU_USERNAME=dev.brandon.o@gmail.com
KITSU_PASSWORD=5J228TPnbC@UCpS


access_token: 6-a6yKoQWzj2u5nwOvPN2gHMP_F5K5jCDMK2OtA9N9w
token_type: Bearer
expires_in: 2588107
refresh_token: JpL2jhZX-jX5aLOeI6P2F9eDngoKLlpw9UoMypYAobk // This one is really important
scope: public
created_at: 1720171338
*/