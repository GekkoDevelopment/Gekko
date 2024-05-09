const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Fun Commands:")
    .addFields(
    {
        name: "Commands",
        value: "8 Ball \nDice \nGif \nMeme \nQuote \nWeather",
        inline: true,
    },
    {
        name: "Usage",
        value: "`/8-ball` \n`/dice` \n`/meme` \n`/quote` \n`/weather`",
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
