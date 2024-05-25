import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import MySQL from "../../../models/mysql.js";
import config from "../../../config.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("reset-prefix")
    .setDescription('Reset the prefix back to the default which is "!"'),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const permissionErrorEmbed = embeds.get('permissionsError')(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;
    const originalPrefix = "!";

    MySQL.editColumnInGuilds(guildId, "guild_prefix", originalPrefix);

    const embed = new EmbedBuilder()
      .setTitle(`${config.emojis.passed} Prefix successfully set`)
      .setDescription("The bot prefix has been set back to: `!`")
      .setColor("Green")
      .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setImage(config.assets.gekkoBanner);

    interaction.reply({ embeds: [embed] });
  },
};
