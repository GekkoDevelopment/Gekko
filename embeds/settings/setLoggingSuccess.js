const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Logging Channel Set`)
  .setColor('Green')
  .setDescription(`**Your new Logging Channel:** \n<#${data.value}>`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};