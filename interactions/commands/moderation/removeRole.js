import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import MySQL from '../../../models/mysql.js';
import config from "../../../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("remove-role")
    .setDescription("Remove a role to a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select a role to assign to the user")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const user = interaction.options.getMember("user");
      const role = interaction.options.getRole("role");
      const member = await interaction.guild.members.fetch(user);

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

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)
      ) {
        const permissionErrorEmbed =
          embeds.get("permissionsError")(interaction);
        return await interaction.reply({
          embeds: [permissionErrorEmbed],
          ephemeral: true,
        });
      }

      if (
        interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0
      ) {
        const permissionErrorEmbed = embeds.get("botRoleError")(interaction);
        return await interaction.reply({
          embeds: [permissionErrorEmbed],
          ephemeral: true,
        });
      }

      await member.roles.remove(role);

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.passed} Successfully Removed Roles`)
        .setDescription(
          `${interaction.user} removed the ${role} role from ${user}`
        )
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: interaction.client.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [embed] });
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
