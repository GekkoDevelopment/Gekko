import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setDescription(`${config.emojis.warning} *Deleting Ticket...*`)
      .setColor("Red"),
};
