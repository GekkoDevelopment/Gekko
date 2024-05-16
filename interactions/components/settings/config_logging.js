import { PermissionFlagsBits, ActionRowBuilder, ChannelSelectMenuBuilder } from 'discord.js';
import MySQL from '../../../models/mysql';

export default {
  data: { name: "config_logging" },
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const value = interaction.values[0];
    if (value === "mod") {
        const modLogChannelSelect = new ChannelSelectMenuBuilder()
        .setChannelTypes('GuildText')
        .setCustomId('modLogChannelSelect')
        .setPlaceholder('✧˚ · . Select/Search for channels');

        const actionRow1 = new ActionRowBuilder().addComponents(modLogChannelSelect);
        const msg = '🔍 Assign a Moderation Logs Channel';
        await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });

    }

    if (value === "ticket") {
        const ticketLogChannelSelect = new ChannelSelectMenuBuilder()
        .setChannelTypes('GuildText')
        .setCustomId('ticketLogChannelSelect')
        .setPlaceholder('✧˚ · . Select/Search for channels');

        const actionRow1 = new ActionRowBuilder().addComponents(ticketLogChannelSelect);
        const msg = '🔍 Assign a Ticket Logs Channel';
        await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
    }

    if (value === "command") {
        const commandsLogChannelSelect = new ChannelSelectMenuBuilder()
        .setChannelTypes('GuildText')
        .setCustomId('commandsLogChannelSelect')
        .setPlaceholder('✧˚ · . Select/Search for channels');

        const actionRow1 = new ActionRowBuilder().addComponents(commandsLogChannelSelect);
        const msg = '🔍 Assign a Commands Logs Channel';
        await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
    }

    if (value === "message") {
        const messageLogChannelSelect = new ChannelSelectMenuBuilder()
        .setChannelTypes('GuildText')
        .setCustomId('messageLogChannelSelect')
        .setPlaceholder('✧˚ · . Select/Search for channels');

        const actionRow1 = new ActionRowBuilder().addComponents(messageLogChannelSelect);
        const msg = '🔍 Assign a Message Logs Channel';
        await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
    }

    if (value === "audit") {
        const auditLogChannelSelect = new ChannelSelectMenuBuilder()
        .setChannelTypes('GuildText')
        .setCustomId('auditLogChannelSelect')
        .setPlaceholder('✧˚ · . Select/Search for channels');

        const actionRow1 = new ActionRowBuilder().addComponents(auditLogChannelSelect);
        const msg = '🔍 Assign an Audit Logs Channel';
        await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
    }

    if (value === "disable") {
        MySQL.deleteRow('logging', 'guild_id', interaction.guild.id);

        const disabledEmbed = embeds.get("featureDisabled")(interaction);
        await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
    }
  },
};
