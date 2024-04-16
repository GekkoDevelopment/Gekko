const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Start a game of chess!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
        async execute(interaction) {
            const playerA = interaction.user;
            const playerB = interaction.options.getUser('user');

            const Lichess = await fetch('https://lichess.org/api/challenge');
        }
};

// lip_DMx26QizmDMq5YcCPPVD = API KEY ??? 