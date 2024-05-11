const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Lockdown Channel(s) Set`)
  .setColor('Green')
  .setDescription(`**Your new Lockdown Channel(s):** \n${data.formattedChannels}`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};