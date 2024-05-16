import { EmbedBuilder } from 'discord.js';
import config from '../../config';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
      .addFields({
        name: "Error Message:",
        value:
          "```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```",
        inline: true,
      })
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
