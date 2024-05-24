import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import color from '../../../models/colors.js';
import config from '../../../config.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("current-prefix")
    .setDescription("Tells you what the current bot prefix is."),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const currentPrefix = await MySQL.getColumnValuesWithGuildId(
      guildId,
      "guild_prefix"
    );

    DiscordExtensions.checkIfRestricted(interaction);

    const embed = new EmbedBuilder()
      .setDescription(
        `The current prefix for the bot is: \`${currentPrefix.toString()}\``
      )
      .setColor(color.bot)
      .setImage(config.assets.gekkoBanner);

    interaction.reply({ embeds: [embed] });
  },
};
