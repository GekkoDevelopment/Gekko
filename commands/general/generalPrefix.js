const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const color = require('../../models/colors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('general-prefix').setDescription('reset the prefix back to the default which is "!"'),
    async execute(interaction) {
        
    }
}