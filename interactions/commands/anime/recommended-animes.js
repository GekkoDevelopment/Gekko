import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import Http from '../../../models/HTTP.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName('recommended-animes').setDescription('Gives you a list of recommended animes.'),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
        
        const headers = {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        }

        const option = await Http.performHttpGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
        const data = await option.json();
    }
}