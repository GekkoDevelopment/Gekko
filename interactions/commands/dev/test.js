import { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandMentionableOption } from "discord.js";
import Http from "../../../models/HTTP.js";

export default {
    data: new SlashCommandBuilder()
        .setName('test').setDescription('Test a feature (used by dev for HTTP requests or MySQL testing)')
        .addStringOption(option => option.setName('invite-link').setDescription('discord server link.')),
    async execute(interaction) {
        const inviteLink = interaction.options.getString('invite-link');

        const data = await Http.performGetRequest(inviteLink);
        console.log(data);

        interaction.reply('fetching.');
    }
}