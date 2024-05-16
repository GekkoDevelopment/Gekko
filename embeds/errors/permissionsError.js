import { EmbedBuilder } from 'discord.js';
import config from '../../config';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
      .addFields({
        name: "Error Message:",
        value: "```\nYou lack permissions to perform that action```",
        inline: true,
      })
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
