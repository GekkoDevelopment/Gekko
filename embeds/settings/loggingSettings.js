const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const colors = require("../../models/colors");

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Logging Settings`)
  .setDescription('Let\'s take a moment to configure your **Logging** settings! Below, is an example of your **Logging** configuration, you can edit this with the select menus below')
  .setColor(colors.bot)
  .addFields(
    {
        name: 'Moderation Logs',
        value: `${data.guildModLog} \n${data.guildModChannel}`
    },
    {
        name: 'Ticket Logs',
        value: `${data.guildTicketLog} \n${data.guildTicketChannel}`
    },
    {
        name: 'Commands Log',
        value: `${data.guildCommandLog} \n${data.guildCommandChannel}`
    },
    {
        name: 'Message Logs',
        value: `${data.guildMsgLog} \n${data.guildMsgChannel}`
    },
    {
        name: 'Auidt Logs (all)',
        value: `${data.guildAuditLog} \n${data.guildAuditChannel}`
    }
  )

};