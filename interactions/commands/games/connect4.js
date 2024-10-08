import { SlashCommandBuilder } from 'discord.js';
import Connect4 from "discord-gamecord/src/Connect4.js";
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("connect-4")
    .setDescription("Start a game of Connect 4 Game")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to play with.")
        .setRequired(true)
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    const Game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("user"),
      embed: {
        title: "Connect4 Game",
        statusTitle: "Status",
        color: "#7B598D",
      },
      emojis: {
        board: "⚪",
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the Connect4 Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      return;
    });
  },
};
