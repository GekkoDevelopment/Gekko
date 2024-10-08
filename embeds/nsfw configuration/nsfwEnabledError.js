import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Command Error:`)
    .setDescription(" **NSFW** is already enabled in this guild.")
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor(colors.deepPink),
};
