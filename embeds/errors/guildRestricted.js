import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Permissions Error: 50105`)
      .addFields({
        name: "Error Message:",
        value:
          "```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```",
        inline: true,
      })
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
