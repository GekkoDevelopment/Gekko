const { PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");

module.exports = {
    data: { name: "lockdownChannelsSelect" },
    async execute(interaction) {
          const value = interaction.values;
          await MySQL.bulkInsertOrUpdate('lockdown_config', ['guild_id', 'channel_id'], [[interaction.guild.id, value.toString()]]);
  
          const formattedChannels = value.map((channelId) => `<#${channelId}>`).join("\n");
  
          const successEmbed = embeds.get('lockdownChannelSuccess')(interaction, {formattedChannels});
          await interaction.reply({ embeds: [successEmbed], ephemeral: true });
      }
  }