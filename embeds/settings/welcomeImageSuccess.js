const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Welcome Image Set`)
  .setColor('Green')
  .setDescription(`**Your new Welcome Image:** \n${data.welcomeImg}`)
  .setImage(data.welcomeImg)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};