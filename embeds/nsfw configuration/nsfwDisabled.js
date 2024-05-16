import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.passed} NSFW disabled`)
    .setDescription("Okay, **NSFW** Commands are disabled!")
    .setColor(colors.deepPink)
    .setTimestamp()
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    }),
};
