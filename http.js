// a file just to get information and perform http requests without running commands on discord.
import Http from "./models/HTTP.js";
import dotenv from 'dotenv';

dotenv.config();

try {
    const animeName = '';
    const headers = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': "Bearer 6-a6yKoQWzj2u5nwOvPN2gHMP_F5K5jCDMK2OtA9N9w"
    }

    const option = await Http.performGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
    const data = option.json();

    if (DataTransfer.data && data.data.length > 0) {
        const animeData = data.data[0];
        console.log(animeData.attribues);
    }

    console.log(data);
    
} catch (error) {
    console.error(error);
}

/*
access_token: 6-a6yKoQWzj2u5nwOvPN2gHMP_F5K5jCDMK2OtA9N9w
token_type: Bearer
expires_in: 2588107
refresh_token: JpL2jhZX-jX5aLOeI6P2F9eDngoKLlpw9UoMypYAobk // This one is really important
scope: public
created_at: 1720171338
*/