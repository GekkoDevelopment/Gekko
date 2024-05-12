const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Welcome Settings`)
  .setDescription('Let\'s take a moment to configure your **Welcome** settings! Below, is an example of your welcome configuration, you can edit each of these with the select menus below')
  .setColor(colors.bot)
  .addFields(
    {
        name: 'Welcome Channel',
        value: `> ${data.guildWelcomeChannel}`
    },
    {
        name: 'Welcome Message',
        value: `\`\`\`${data.guildWelcomeMessage}\`\`\``
    },
    {
        name: 'Welcome Image',
        value: `> ${data.guildWelcomeImage}`
    }
  )

};