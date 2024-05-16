import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

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