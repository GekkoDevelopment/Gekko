import { EmbedBuilder } from 'discord.js';
import config from '../../config';

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Welcome Message Set`)
  .setColor('Green')
  .setDescription(`**Your new Welcome Message:** \n${data.welcomeMsg}`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};