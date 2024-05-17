import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Http from '../../../models/HTTP.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('steam-status').setDescription("Check the status of Steam."),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
    }
}