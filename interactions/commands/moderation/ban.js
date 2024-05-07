const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const color = require("../../../models/colors.js");
const MySQL = require("../../../models/mysql.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from this server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for ban")
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

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.BanMembers
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
          "You cannot ban a bot from the server, please do this manually."
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
          "You cannot ban a user with a role that is the same, or higher than yours."
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
        .setTitle("User Banned")
        .setDescription(
          `> \`${user.tag}\` has been banned. \n> \n> **Moderator:** \n> <@${interaction.member.id}> \n> **Reason:** \n> \`${reason}\``
        )
        .setColor(color.bot);
      await member.ban(reason);
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
