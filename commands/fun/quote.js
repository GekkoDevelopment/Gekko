const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote').setDescription('Generate a random quote.'),
    async execute(interaction) {
        
    }
}