const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setTitle("Admin Commands:")
    .addFields(
    {
        name: "Commands",
        value:
        "Set Logging Channel \nSet Command Prefix \nSet Welcome \nEnable NSFW \nDisable NSFW \nSet Join Roles \nLockdown Config",
        inline: true,
    },
    {
        name: "Usage",
        value:
        "`/set-logging` \n`!set-prefix`, `/set-prefix` \n`/set-welcome` \n`/allow-nsfw` \n`/disallow-nsfw` \n`/set-join-roles` \n`/lockdown-config`",
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
