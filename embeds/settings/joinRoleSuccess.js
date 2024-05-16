import { EmbedBuilder } from 'discord.js';
import config from '../../config';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Join Role(s) Set`)
  .setColor('Green')
  .setDescription(`**Your new Join Role(s):** \n${data.guildJoinRoles}`)
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};