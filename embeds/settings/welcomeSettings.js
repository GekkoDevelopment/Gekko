import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
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