import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Fun Commands:")
    .addFields(
    {
        name: "Commands",
        value: "8 Ball \nDice \nGif \nMeme \nQuote \nWeather",
        inline: true,
    },
    {
        name: "Usage",
        value: "`/8-ball` \n`/dice` \n`/meme` \n`/quote` \n`/weather`",
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
