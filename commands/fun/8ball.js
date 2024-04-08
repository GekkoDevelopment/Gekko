const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather').setDescription('Ask the magic 8-Ball a question.')
        .addStringOption(option => option.setName('question').setDescription('The question to ask the magic 8-Ball.').setRequired()),
    async execute(interaction) {
        
    }
}