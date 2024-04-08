const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif').setDescription('Get a random GIF.')
        .addStringOption(option => option.setName('term').setDescription('The search term you want your meme to have.').setRequired(true)),
    async execute(interaction) {
        
    }
}