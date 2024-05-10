const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Join Role(s) Set`)
  .setColor('Green')
  .setDescription(`**Your new Join Role(s):** \n${data.guildJoinRoles}`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};