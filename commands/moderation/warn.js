const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn').setDescription('Warn a specific member.')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason to warn the user.').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        
    }
}