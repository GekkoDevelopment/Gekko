import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Logging Channel Set`)
  .setColor('Green')
  .setDescription(`**Your new Logging Channel:** \n<#${data.value}>`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};