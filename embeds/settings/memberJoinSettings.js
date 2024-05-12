const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Join Roles`)
  .setDescription('Let\'s take a moment to configure your **Join Roles** settings! Below, is an example of your **Join Roles** configuration, you can edit this with the select menus below')
  .setColor(colors.bot)
  .addFields(
    {
        name: 'Join Roles',
        value: `${data.guildJoinRoles}`
    }
  )

};