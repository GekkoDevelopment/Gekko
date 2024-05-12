const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Ticket Closed`)
      .setDescription(`Ticket was closed by <@${interaction.user.id}>`)
      .setColor("Orange")
      .setTimestamp()
      .setFooter({ text: "Ticket Closed At:" }),
};
