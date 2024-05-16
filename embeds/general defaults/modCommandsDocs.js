import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Moderation Commands:")
    .addFields(
    {
        name: "Commands",
        value:
        "Ban a user \nCreate Embed \nKick a user \nLock a channel \nServer Lockdown \nServer Unlock \nMute a user \nPurge \nUnlock a channel",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`/ban` \n`/create-embed` \n`/kick` \n`/lock` \n`/lockdown-start` \n`/lockdown-end` \n`/mute` \n`/purge` \n`/unlock`",
        inline: true,
    }
    )
    .setImage(config.assets.gekkoBanner)
    .setColor(colors.bot)
    .setTimestamp()
    .setFooter({
    text: "Gekkō",
    iconURL: interaction.client.user.displayAvatarURL(),
    }),
};
