import { EmbedBuilder } from 'discord.js';
import config from '../../config';
module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Welcome Image Set`)
  .setColor('Green')
  .setDescription(`**Your new Welcome Image:** \n${data.welcomeImg}`)
  .setImage(data.welcomeImg)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};