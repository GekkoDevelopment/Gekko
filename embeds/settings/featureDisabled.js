import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setTitle(`${config.emojis.passed} Disabled`)
  .setColor(colors.bot)
  .setDescription('Successfully disabled this feature')
  .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() }),
};