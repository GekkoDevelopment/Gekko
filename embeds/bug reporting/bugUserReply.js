import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.passed} Bug Report Submitted`)
    .setDescription(
        "> Your bug report was submitted to our development team for review. \n> ***You submitted the following information:***"
    )
    .addFields(
        {
        name: "Bug ID",
        value: `\`${data.bugID}\``,
        inline: false,
        },
        {
        name: "Guild ID:",
        value: `${data.guildId}`,
        inline: false
        },
        {
        name: "Reportee",
        value: `${data.userDisplayName} (ID: ${data.userId})`,
        inline: false,
        },
        {
        name: "Bug Description",
        value: `${data.bugDescription}`,
        inline: false,
        },
        {
        name: "Video",
        value:
            `${data.bugVideo}` ||
            "None Provided.",
        inline: false,
        }
    )
    .setColor(colors.bot)
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
};
