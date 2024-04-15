const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Start a game of chess!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
        async execute(interaction) {

        }
};