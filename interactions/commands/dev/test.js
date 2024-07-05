import { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandMentionableOption } from "discord.js";
import Http from "../../../models/HTTP.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
//import translate from '../../components/utils/translate.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName('test').setDescription('Test a feature (used by dev for HTTP requests or MySQL testing)')
        .addStringOption(option => option.setName('message').setDescription('message')),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const animeName = interaction.options.getString('test');
            const headers = {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                'grant_type': 'password',
                'username': process.env.KITSU_USERNAME,
                'password': process.env.KITSU_PASSWORD
            };
            const data = await Http.performGetRequest('https://kitsu.io/api/oauth/token', headers)
            console.log(data);
            interaction.editReply('test');
        } catch (error) {
            DiscordExtensions.sendErrorEmbed(error, interaction);
        }
    }
}