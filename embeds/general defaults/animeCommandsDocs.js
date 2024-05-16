import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Anime Commands:")
    .addFields(
    {
        name: "Commands",
        value:
        "Anime Character \nAnime Info \nAnime Quotes \nHug \nWaifu",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`/anime-character` \n`!anime-info`, `/anime-info` \n`/anime-quotes` \n`/hug` \n`/waifu`",
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
