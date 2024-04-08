const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8-ball').setDescription('Ask the magic 8-Ball a question.')
        .addStringOption(option => option.setName('question').setDescription('The question to ask the magic 8-Ball.').setRequired(true)),
    async execute(interaction) {
        
    }
}