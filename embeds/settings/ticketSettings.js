import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Ticketing Feature`)
  .setDescription('Let\'s take a moment to configure your **Ticketing** settings! Below, is your current **Ticketing** configuration, you can edit this with the select menus below \n\nWhen you\'ve finished, you can launch yout ticket system with the `/launch-tickets` command')
  .setColor(colors.bot)
  .addFields(
    {
        name: 'Ticket Channel',
        value: `${data.guildTicketChannel}`
    },
    {
        name: 'Ticket Category',
        value: `${data.guildTicketCategory}`
    },
    {
        name: 'Ticket Support Roles',
        value: `${data.guildSupportRoles}`
    }
  )

};