const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.failed} Bug Report Rejected`)
      .setDescription(`**Bug ${data.bugId} was rejected**`)
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
