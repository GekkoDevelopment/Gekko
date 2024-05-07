const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${emojis.warning} Permissions Error: 50105`)
      .addFields({
        name: "Error Message:",
        value:
          "```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```",
        inline: true,
      })
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL(),
      }),
};
