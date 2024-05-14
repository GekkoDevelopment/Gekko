const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam-info').setDescription("Give you your or another user's steam info. (name, hex, etc.)"),
    async execute(interaction) {
        
    }
}