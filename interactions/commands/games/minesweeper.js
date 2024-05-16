import { SlashCommandBuilder } from 'discord.js';
import { Minesweeper } from 'discord-gamecord';
import MySQL from '../../../models/mysql';
import colors from '../../../models/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("minesweeper")
    .setDescription("Play a game of Minesweeper"),
  async execute(interaction) {
    const Game = new Minesweeper({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Minesweeper",
        color: colors.bot,
        description: "Click on the buttons to reveal the blocks except mines.",
      },
      emojis: { flag: "🚩", mine: "💣" },
      mines: 5,
      timeoutTime: 60000,
      winMessage: "You won the Game! You successfully avoided all the mines.",
      loseMessage: "You lost the Game! Beaware of the mines next time.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    const restricted = MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      interaction.guild.id
    );

    if (restricted === "true") {
      const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    Game.startGame();
    Game.on("gameOver", (result) => {});
  },
};
