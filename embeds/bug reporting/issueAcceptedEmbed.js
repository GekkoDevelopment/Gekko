import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.passed} Bug Report Accepted`)
      .setDescription(`**[Bug ${data.bugId} was sent to github](${data.issueUrl})**`)
      .setColor("Green")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
