import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import colors from '../../../models/colors.js';

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from this server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for Kick")
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

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.KickMembers
      )
    ) {
      const permissionErrorEmbed = embeds.get("botPermissionsError")(
        interaction
      );
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const member = await interaction.guild.members.fetch(user.id);

    if (user.bot) {
      const botErrorEmbed = new EmbedBuilder()
        .setTitle("Action Error:")
        .setDescription(
          "You cannot kick a bot from the server, please do this manually."
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō Development",
          iconURL: interaction.client.user.displayAvatarURL(),
        });
      return await interaction.reply({
        embeds: [botErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      member.roles.highest.comparePositionTo(
        interaction.member.roles.highest
      ) >= 0
    ) {
      const roleErrorEmbed = new EmbedBuilder()
        .setTitle("Permissions Error:")
        .setDescription(
          "You cannot kick a user with a role that is the same, or higher than yours."
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō Development",
          iconURL: interaction.client.user.displayAvatarURL(),
        });
      return await interaction.reply({
        embeds: [roleErrorEmbed],
        ephemeral: true,
      });
    }

    try {
      const successEmbed = new EmbedBuilder()
        .setTitle("User Kicked")
        .setDescription(
          `> \`${user.tag}\` has been kicked. \n> \n> **Moderator:** \n> <@${interaction.member.id}> \n> **Reason:** \n> \`${reason}\``
        )
        .setColor(colors.bot);

      await member.kick(reason);
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
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
