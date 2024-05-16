import { EmbedBuilder } from 'discord.js';
import config from '../../config';
import colors from '../../models/colors';

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
    .setTitle(`${config.emojis.warning} Enable Not Safe For Work Feature`)
    .setColor(colors.deepPink)
    .setDescription(
      "This command turns on NSFW anime features (such as the waifu command will show NSFW images)." +
        "This command/feature is turned off by default... **Are you sure you want to enable this feature?**"
    ),
};
