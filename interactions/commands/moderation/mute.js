const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user from your discord server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason to mute the user. (optional)")
    ),
  async execute(interaction) {
    const restricted = MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      interaction.guild.id
    );

    if (restricted === "true") {
      const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const mutedUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const undefinedReason = undefined;
    const muteReason = undefinedReason ? "No Reason Provided" : `${reason}`;

    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.editReply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const mutedRole = interaction.guild.roles.cache.get(
      (x) => x.name === "muted"
    );
    const mutedRoleId = mutedRole.id;

    const sqlRoleId = await MySQL.getValueFromTableWithCondition(
      "muted_users",
      "role_id",
      "guild_id",
      interaction.guild.id
    );

    if (sqlRoleId === null || sqlRoleId === "undefined") {
      if (mutedRole !== null) {
        MySQL.insertOrUpdateValue("muted_users", "role_id", mutedRoleId);
        mutedUser.roles.add(mutedRole);

        interaction.editReply(
          `Successfully muted ${mutedUser.name} for: ${muteReason}`
        );
      } else {
      }
    }
  },
};
