const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Ticket Category Set`)
  .setColor('Green')
  .setDescription(`**Your new Ticket Category:** \n<#${data.value}>`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};