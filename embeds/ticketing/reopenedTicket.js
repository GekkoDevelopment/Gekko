const { EmbedBuilder } = require("discord.js");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Reopened")
      .setDescription(`> <@${interaction.user.id}> has reopened this ticket.`)
      .setColor(colors.bot)
      .setTimestamp(),
};
