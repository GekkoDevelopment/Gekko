const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("General Commands:")
    .addFields(
    {
        name: "Commands",
        value: "Help \nPing \nBug Report \nGekko",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`",
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
