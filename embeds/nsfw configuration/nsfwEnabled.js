const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${emojis.passed} NSFW Enabled`)
      .setDescription(
        "Okay! **NSFW** Commands are enabled but they can only be used in this channel."
      )
      .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor(colors.deepPink),
};
