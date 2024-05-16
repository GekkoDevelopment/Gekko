import { EmbedBuilder } from 'discord.js';
import config from '../../config';

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Economy Disabled`)
      .setDescription('The **Economy** feature is disabled in this guild. Ask an administrator to enable it!')
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
