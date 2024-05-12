const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Command Error:`)
    .setDescription(" **NSFW** is already enabled in this guild.")
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor(colors.deepPink),
};
