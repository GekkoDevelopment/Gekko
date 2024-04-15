const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const color = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack').setDescription('Start a game of blackjack.')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount to "bet".')),
    async execute(interaction) {
    }
}