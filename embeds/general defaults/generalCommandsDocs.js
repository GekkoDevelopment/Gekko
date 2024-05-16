import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("General Commands:")
    .addFields(
    {
        name: "Commands",
        value: "Help \nPing \nBug Report \nGekko",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`",
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
