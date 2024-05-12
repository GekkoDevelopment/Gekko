const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
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
