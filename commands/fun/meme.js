const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme').setDescription('Get a random meme.'),
    async execute(interaction) {
        
    }
}