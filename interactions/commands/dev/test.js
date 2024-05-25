import { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandMentionableOption } from "discord.js";
import Http from "../../../models/HTTP.js";
import MySQL from "../../../models/mysql.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
import dotenv from 'dotenv';

dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName('test').setDescription('Test a feature (used by dev for HTTP requests or MySQL testing)')
        .addStringOption(option => option.setName('invite-link').setDescription('discord server link.')),
    async execute(interaction) {
        const inviteLink = interaction.options.getString('invite-link');
        await interaction.deferReply();

        try {
            await interaction.editReply('fetching.');
            const url = 'https://kitsu.io/api/oauth/token';

            const headers = {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
              }
            
            const body = {
                grant_type: 'password',
                username: '<email|slug>',
                password: '<password>' // RFC3986 URl encoded string
            }

            const response = await Http.performPostRequest(url, headers, body);
            const data = await response.json();

            console.log(data);
            
        } catch (error) {
            DiscordExtensions.sendErrorEmbed(error, interaction);
        }
    }
}