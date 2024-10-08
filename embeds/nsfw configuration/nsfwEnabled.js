import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.passed} NSFW Enabled`)
      .setDescription(
        "Okay! **NSFW** Commands are enabled but they can only be used in this channel."
      )
      .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor(colors.deepPink),
};
