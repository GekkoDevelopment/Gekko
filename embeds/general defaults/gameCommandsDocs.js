import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Minigame Commands:")
    .addFields(
    {
        name: "Commands",
        value:
        "Connect Four \nGuess the Logo \nMinesweeper \nSnake \nTicTacToe \nWhat's that Pokemon \nWordle",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`/connect-4` \n`/guess-the-logo` \n`/minesweeper` \n`/snake` \n`/tic-tac-toe` \n`/whats-that-pokemon` \n`wordle`",
        inline: true,
    }
    )
    .setImage(config.assets.gekkoBanner)
    .setColor(colors.bot)
    .setTimestamp()
    .setFooter({
    text: "Gekkō",
    iconURL: interaction.client.user.displayAvatarURL(),
    }),
};
