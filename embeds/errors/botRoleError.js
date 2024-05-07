const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${emojis.warning} Permissions Error: 50013`)
      .addFields({
        name: "Error Message:",
        value: "```\nMy role is NOT high enough to perform this action```",
        inline: true,
      })
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
