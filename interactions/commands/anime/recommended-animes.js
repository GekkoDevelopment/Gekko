import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Http } from '../../../models/HTTP';
import { DiscordExtensions } from '../../../models/DiscordExtensions';
import pagination from '../../components/utils/pagination';

export default {
    data: new SlashCommandBuilder()
        .setName('recommended-animes').setDescription('Gives you a list of recommended animes.'),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);

        const embeds = [];
        for (var i = 0; i < 3; i++) {
            embeds.push(new EmbedBuilder().setDescription(`Page ${i + 1}`));
            await pagination(interaction, embeds);
        }
    }
}