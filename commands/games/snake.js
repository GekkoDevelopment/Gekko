const { Snake } = require('discord-gamecord')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Start a game of Classic Snake'),
    async execute(interaction) {
        const Game = new Snake({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Snake Game',
                overTitle: 'Game Over',
                color: '#7B598D'
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆️',
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            stopButton: 'Stop',
            timoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '☠️'},
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        });
    }
}