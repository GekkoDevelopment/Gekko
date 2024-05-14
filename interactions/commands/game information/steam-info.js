const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam-info').setDescription("Give you your or another user's steam info. (name, hex, etc.)")
        .addStringOption(option => option.setName('username').setDescription('The user you want to look up').setRequired(true)),
    async execute(interaction) {

    }
}