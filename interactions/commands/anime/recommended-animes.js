import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import Http from '../../../models/HTTP.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
// import pagination from '../../components/utils/pagination.js';

export default {
    data: new SlashCommandBuilder()
        .setName('recommended-animes').setDescription('Gives you a list of recommended animes.'),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
        
    }
}