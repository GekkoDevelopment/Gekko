const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const MySQL = require("../../../models/mysql.js");
const config = require("../../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown-start")
    .setDescription("Start Lockdown"),

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

    try {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)
      ) {
        const permissionErrorEmbed =
          embeds.get("permissionsError")(interaction);
        return await interaction.reply({
          embeds: [permissionErrorEmbed],
          ephemeral: true,
        });
      }

      if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.ManageChannels
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

      const channelIds = await MySQL.getValueFromTableWithCondition(
        "lockdown_config",
        "channel_id",
        "guild_id",
        interaction.guild.id
      );

      const channelIdsArray = channelIds.split(",");
      const affectedChannels = [];

      for (const channelId of channelIdsArray) {
        const channel = interaction.guild.channels.cache.get(channelId);
        if (channel) {
          await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: false,
          });
          affectedChannels.push(`<#${channel.id}>`);
        } else {
          console.log(`Channel with ID ${channelId} not found.`);
        }
      }

      const successEmbed = new EmbedBuilder()
        .setTitle(`${config.emojis.exclamationMark} Lockdown Commenced`)
        .setDescription(`> Your server has been locked down.`)
        .addFields(
          {
            name: "Affected Channels",
            value: affectedChannels.join("\n"),
          },
          {
            name: `Invoked by:`,
            value: `<@${interaction.user.id}>`,
          }
        )
        .setColor("Red")
        .setFooter({
          text: "Gekkō",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });
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
