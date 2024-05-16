import { SlashCommandBuilder } from 'discord.js';
import { Wordle } from 'discord-gamecord';
import MySQL from '../../../models/mysql';
import colors from '../../../models/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wordle")
    .setDescription("Start a game of Wordle"),
  async execute(interaction) {
    const Game = new Wordle({
      message: interaction,
      isSlashGame: false,
      embed: {
        title: "Wordle",
        color: colors.bot,
      },
      customWord: null,
      timeoutTime: null,
      winMessage: "You won! The word was **{word}**.",
      loseMessage: "You lost! The word was **{word}**.",
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
