import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import config from '../../../config.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("set-prefix")
    .setDescription("Changes the prefix for prefix based commands.")
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("The new prefix for the bot.")
        .setRequired(true)
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;
    const newPrefix = interaction.options.getString("prefix");

    MySQL.editColumnInGuilds(guildId, "guild_prefix", newPrefix);

    const prefixEmbed = new EmbedBuilder()
      .setTitle(`${config.emojis.passed} Prefix successfully set`)
      .setDescription(
        `You're new bot prefix has been changed to: \`${newPrefix}\``
      )
      .setColor("Green")
      .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setImage(config.assets.gekkoBanner);

    await interaction.reply({ embeds: [prefixEmbed] });
  },
};
