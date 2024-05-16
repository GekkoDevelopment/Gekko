import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Enable Not Safe For Work Feature`)
    .setColor(colors.deepPink)
    .setDescription("**Are you sure you're sure?**"),
};
