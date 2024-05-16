import {  EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Ticket Closed`)
      .setDescription(`Ticket was closed by <@${interaction.user.id}>`)
      .setColor("Orange")
      .setTimestamp()
      .setFooter({ text: "Ticket Closed At:" }),
};
