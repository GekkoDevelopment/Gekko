const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${emojis.warning} Command Error:`)
    .setDescription(" **NSFW** is already disabled in this guild.")
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor(colors.deepPink),
};
