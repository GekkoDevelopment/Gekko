import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("disallow-nsfw")
    .setDescription(
      "Disallow NSFW commands. The NSFW feature is usually off by default."
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const isNsfw = await MySQL.getColumnValuesWithGuildId(
      guildId,
      "nsfw_enabled"
    );
    
    DiscordExtensions.checkIfRestricted(interaction);

    try {
      if (
        interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        isNsfw.toString() === "true"
      ) {
        const disableEmbed = embeds.get("nsfwDisabled")(interaction);
        MySQL.editColumnInGuilds(guildId, "nsfw_enabled", "false");
        await interaction.reply({ embeds: [disableEmbed], ephemeral: true });
      } else {
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
          isNsfw.toString() === "false"
        ) {
          const disabledEmbed = embeds.get("nsfwDisabledError")(interaction);
          await interaction.reply({ embeds: [disabledEmbed] });
        }
      }
    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
        errorMessage,
        errorDescription,
      });
      await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
    }
  },
};
