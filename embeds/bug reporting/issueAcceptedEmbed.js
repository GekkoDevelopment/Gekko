const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${emojis.passed} Bug Report Accepted`)
      .setDescription(`**[Bug ${data.bugId} was sent to github](${data.issueUrl})**`)
      .setColor("Green")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
