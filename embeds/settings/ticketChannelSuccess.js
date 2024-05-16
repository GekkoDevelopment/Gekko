import { EmbedBuilder } from 'discord.js';
import config from '../../config';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Ticket Channel Set`)
  .setColor('Green')
  .setDescription(`**Your new Ticket Channel:** \n<#${data.value}>`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};