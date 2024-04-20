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
          
          const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

          if (restricted === 'true') {
              const permissionErrorEmbed = new EmbedBuilder()
              .setTitle('Permissions Error: 50105')
              .addFields(
                  {
                      name: 'Error Message:',
                      value: '```\nYour guild has been banned by the Gekkō Development Team. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                      inline: true
                  }
              )
              .setColor('Red')
              .setTimestamp()
              .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
              return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
          }
          
          Game.startGame();
          Game.on('gameOver', result => {
          });
    }
}