const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Start a game of Blackjack!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
        async execute(interaction) {

        }
};