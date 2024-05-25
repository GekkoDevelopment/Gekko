import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('slots').setDescription('Play some slots and see if you can win a prize.')
        .addIntegerOption(option => option.setName('amount').setDescription('the amount of money you want to play with.')),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
    }
}