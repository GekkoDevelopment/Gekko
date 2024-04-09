const { Wordle } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Start a game of Wordle'),
    async execute(interaction) {
        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
              title: 'Wordle',
              color: colors.bot,
            },
            customWord: null,
            timeoutTime: null,
            winMessage: 'You won! The word was **{word}**.',
            loseMessage: 'You lost! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
          });
    }
}