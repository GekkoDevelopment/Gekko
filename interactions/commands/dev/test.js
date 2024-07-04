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
          const url = `https://api.consumet.org/anime/9anime/demon?page=2`;

          const data = async () => {
            
          }
        } catch (error) {
            DiscordExtensions.sendErrorEmbed(error, interaction);
        }
    }
}