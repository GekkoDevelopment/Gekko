import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Command Error:`)
    .setDescription(" **NSFW** is already disabled in this guild.")
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setColor(colors.deepPink),
};
