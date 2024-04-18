const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const color = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots').setDescription('Play some slots and see if you can win a prize.')
        .addIntegerOption(option => option.setName('amount').setDescription('the amount of money you want to play with.')),
    async execute(interaction) {
        
    }
}