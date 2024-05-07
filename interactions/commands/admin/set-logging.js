const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  ALLOWED_SIZES,
} = require("discord.js");
const MySQL = require("../../../models/mysql.js");
const { emojis } = require("../../../config.js");
const colors = require("../../../models/colors.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-logging")
    .setDescription("Set a specific channel that contains discord logs.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to have discord logging")
        .setRequired(true)
    ),
  async execute(interaction) {
    const setChannel = interaction.options.getChannel("channel");
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

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ViewAuditLog
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

    const embed = new EmbedBuilder()
      .setTitle("Gekkō Logging")
      .addFields(
        {
          name: `${emojis.exclamationMark} Getting Started:`,
          value:
            "Use the drop-down menu below to start configuring the type of logging you wish to have.",
        },
        {
          name: `${emojis.questionMark} Further Support`,
          value:
            "For more help on setting up the bot, feel free to read our Documentation, or join our support server for help.",
        }
      )
      .setColor(colors.bot)
      .setFooter({
        text: `${interaction.client.user.username}`,
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    const options = [
      {
        label: "Moderation",
        emoji: emojis.configuration,
        value: "mod",
      },
      {
        label: "Ticketing",
        emoji: emojis.configuration,
        value: "ticket",
      },
      {
        label: "Commands",
        emoji: emojis.configuration,
        value: "command",
      },
      {
        label: "Messages",
        emoji: emojis.configuration,
        value: "message",
      },
      {
        label: "Audit Logs",
        emoji: emojis.configuration,
        value: "audit",
      },
      {
        label: "All",
        emoji: emojis.configuration,
        value: "all",
      },
    ];

    const logSelect = new StringSelectMenuBuilder()
      .setCustomId("config_logging")
      .setPlaceholder("Type of logging.")
      .addOptions(options);

    const actionRow = new ActionRowBuilder().addComponents(logSelect);
    await interaction.reply({ embeds: [embed], components: [actionRow] });

    const filter = (i) =>
      i.customId === "config_logging" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: null,
      max: null,
    });

    collector.on("collect", async (interaction) => {
      const value = interaction.values[0];

      try {
        if (value === "mod") {
          await interaction.deferUpdate();
          const logReplyMod = new EmbedBuilder()
            .setTitle(`${emojis.passed} Logging Channel Set`)
            .setColor("Green")
            .setDescription(
              `Ok! Logging for Moderation has been enabled and the logging channel is set to ${setChannel}`
            )
            .setFooter({
              text: `${interaction.client.user.username}`,
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_channel",
            setChannel.id
          );
          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_type",
            "mod"
          );

          interaction.editReply({ embeds: [logReplyMod] });
        }
        if (value === "ticket") {
          await interaction.deferUpdate();
          const logReplyTicket = new EmbedBuilder()
            .setTitle(`${emojis.passed} Logging Channel Set`)
            .setColor("Green")
            .setDescription(
              `Ok! Logging for tickets has been enabled and the logging channel is set to ${setChannel}`
            )
            .setFooter({
              text: `${interaction.client.user.username}`,
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_channel",
            setChannel.id
          );
          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_type",
            "ticket"
          );

          interaction.editReply({ embeds: [logReplyTicket] });
        }
        if (value === "message") {
          await interaction.deferUpdate();
          const logReplyMessage = new EmbedBuilder()
            .setTitle(`${emojis.passed} Logging Channel Set`)
            .setColor("Green")
            .setDescription(
              `Ok! Logging for messages has been enabled and the logging channel is set to ${setChannel}`
            )
            .setFooter({
              text: `${interaction.client.user.username}`,
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_channel",
            setChannel.id
          );
          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_type",
            "message"
          );

          interaction.editReply({ embeds: [logReplyMessage] });
        }
        if (value === "auditLogging") {
          await interaction.deferUpdate();
          const logReplyAudit = new EmbedBuilder()
            .setTitle(`${emojis.passed} Logging Channel Set`)
            .setColor("Green")
            .setDescription(
              `Ok! Logging for audit logs has been enabled and the logging channel is set to ${setChannel}`
            )
            .setFooter({
              text: `${interaction.client.user.username}`,
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_channel",
            setChannel.id
          );
          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_type",
            "auditLogging"
          );

          interaction.editReply({ embeds: [logReplyAudit] });
        }
        if (value === "all") {
          await interaction.deferUpdate();
          const logReplyAll = new EmbedBuilder()
            .setTitle(`${emojis.passed} Logging Channel Set`)
            .setColor("Green")
            .setDescription(
              `Ok! All logging has been enabled and the logging channel is set to ${setChannel}`
            )
            .setFooter({
              text: `${interaction.client.user.username}`,
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_channel",
            setChannel.id
          );
          await MySQL.editColumnInGuilds(
            interaction.guild.id,
            "logging_type",
            "all"
          );

          interaction.editReply({ embeds: [logReplyAll] });
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
        await interaction.channel.send({ embeds: [catchErrorEmbed] });
      }
    });
  },
};
