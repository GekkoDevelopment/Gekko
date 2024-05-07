const { EmbedBuilder } = require("discord.js");
const colors = require("../../models/colors");
const config = require("../../config");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Bug Report`)
    .setThumbnail(config.assets.gekkoLogo)
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
    .setColor("Red")
    .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTimestamp()
};
