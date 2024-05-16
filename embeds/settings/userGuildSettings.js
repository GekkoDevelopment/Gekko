import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

module.exports = {
  embed: (interaction, data, message) => new EmbedBuilder()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
  .setTitle(`${config.emojis.gekkoStar} Gekkō's Configuration Panel`)
  .setDescription('Here is your current bot configuration, you can edit these at any time with the select menus below')
  .setColor(colors.bot)
  .addFields(
    {
        name: `${data.welcomeConfigTitle}`,
        value: `${data.welcomeConfigValue}`,
        inline: true
    },
    {
        name: `${data.joinConfigTitle}`,
        value: `${data.joinConfigValue}`,
        inline: true
    },
    {
        name: `${data.ticketConfigTitle}`,
        value: `${data.ticketConfigValue}`,
        inline: true
    },
    {
        name: `${data.loggingConfigTitle}`,
        value: `${data.loggingConfigValue}`,
        inline: true
    },
    {
        name: `${data.lockdownConfigTitle}`,
        value: `${data.lockdownConfigValue}`,
        inline: true
    },
    {
        name: `${data.nsfwConfigTitle}`,
        value: `${data.nsfwConfigValue}`,
        inline: true
    }
  ),
};
