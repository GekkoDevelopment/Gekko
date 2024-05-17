import { SlashCommandBuilder } from 'discord.js';
import { Wordle } from 'discord-gamecord';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';

export default {
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

    DiscordExtensions.checkIfRestricted(interaction);

    Game.startGame();
    Game.on("gameOver", (result) => {});
  },
};
