import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Ticket Category Set`)
  .setColor('Green')
  .setDescription(`**Your new Ticket Category:** \n<#${data.value}>`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};