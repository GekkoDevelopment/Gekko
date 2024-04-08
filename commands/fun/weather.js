const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather').setDescription('Check the weather in a certain location.')
        .addStringOption(option => option.setName('location').setDescription('The location to get weather for.').setRequired(true)),
    async execute(interaction) {
        
    }
}