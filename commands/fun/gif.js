const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather').setDescription('Ask the magic 8-Ball a question.')
        .addStringOption(option => option.setName('term').setDescription('The search term you want your meme to have.').setRequired()),
    async execute(interaction) {
        
    }
}