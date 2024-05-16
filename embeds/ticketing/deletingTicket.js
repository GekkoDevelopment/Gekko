import { EmbedBuilder } from 'discord.js';
import config from '../../config';

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setDescription(`${config.emojis.warning} *Deleting Ticket...*`)
      .setColor("Red"),
};
