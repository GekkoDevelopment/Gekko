const { Connect4 } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js')
const { color } = require('../../config.js')
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('connnect-4')
    .setDescription('Start a game of Connect 4 Game')
    .addUserOption(option => option.setName('user').setDescription('The User you want to play with').setRequired(true)),
    async execute(interaction) {
        const Game = new Connect4({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('user'),
            embed: {
              title: 'Connect4 Game',
              statusTitle: 'Status',
              color: '#7B598D'
            },
            emojis: {
              board: '⚪',
              player1: '🔴',
              player2: '🟡'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Its turn of player **{player}**.',
            winMessage: '{emoji} | **{player}** won the Connect4 Game.',
            tieMessage: 'The Game tied! No one won the Game!',
            timeoutMessage: 'The Game went unfinished! No one won the Game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            return;
          });
    }
}