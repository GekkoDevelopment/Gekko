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

            const Lichess = await fetch('https://lichess.org/api/challenge', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer lip_DMx26QizmDMq5YcCPPVD`,
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    rated: false,
                    clock: { limit: 300, increment: 0 },
                    color: 'random',
                    variant: 'standard',
                    challenges: { user: [playerB.id] }
                })
            });

            if (!lichessResponse.ok) {
                return interaction.reply('Cant create game for some reason')
            }

            

        }
};

// lip_DMx26QizmDMq5YcCPPVD