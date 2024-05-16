import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Lockdown Settings`)
  .setDescription('Let\'s take a moment to configure your **Lockdown** settings! Below, is an example of your **Lockdown** configuration, you can edit this with the select menus below')
  .setColor(colors.bot)
  .addFields(
    {
        name: 'Lockdown Channels',
        value: `${data.guildLockdownChannels}`
    }
  )

};