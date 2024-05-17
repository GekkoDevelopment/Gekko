import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import Http from '../../../models/HTTP.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js'

export default {
    data: new SlashCommandBuilder()
        .setName('battlenet-status').setDescription("Check the status of Battle.NET"),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
    }
}