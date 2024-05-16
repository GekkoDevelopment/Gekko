import { EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import colors from '../../models/colors.js';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Enable Not Safe For Work Feature`)
    .setColor(colors.deepPink)
    .setDescription("**Are you sure you're sure?**"),
};
