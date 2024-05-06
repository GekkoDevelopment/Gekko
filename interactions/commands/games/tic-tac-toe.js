const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');
const colors = require('../../../models/colors');
const MySQL = require('../../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tic-tac-toe').setDescription('Play a game of TicTacToe')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
    async execute(interaction) {
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('user'),
            embed: {
              title: 'Tic Tac Toe',
              color: colors.bot,
              statusTitle: 'Status',
              overTitle: 'Game Over'
            },
            emojis: {
              xButton: '❌',
              oButton: '🔵',
              blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Its turn of player **{player}**.',
            winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
            tieMessage: 'The Game tied! No one won the Game!',
            timeoutMessage: 'The Game went unfinished! No one won the Game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });
          
          const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

          if (restricted === 'true') {
                const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
          }
          
          Game.startGame();
          Game.on('gameOver', result => {
          });
    }
}