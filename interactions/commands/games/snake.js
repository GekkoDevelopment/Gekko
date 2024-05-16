import { SlashCommandBuilder } from 'discord.js';
import { Snake } from 'discord-gamecord';
import MySQL from '../../../models/mysql';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Start a game of Classic Snake"),
  async execute(interaction) {
    const Game = new Snake({
      message: interaction,
      isSlashGame: false,
      embed: {
        title: "Snake Game",
        overTitle: "Game Over",
        color: "#7B598D",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      stopButton: "Stop",
      timoutTime: 60000,
      snake: { head: "🟢", body: "🟩", tail: "🟢", over: "☠️" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
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
    Game.on("gameOver", (result) => {
      return;
    });
  },
};
