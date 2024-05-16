import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Lockdown Channel(s) Set`)
  .setColor('Green')
  .setDescription(`**Your new Lockdown Channel(s):** \n${data.formattedChannels}`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};