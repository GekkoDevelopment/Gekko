const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${emojis.passed} NSFW disabled`)
    .setDescription("Okay, **NSFW** Commands are disabled!")
    .setColor(colors.deepPink)
    .setTimestamp()
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    }),
};
