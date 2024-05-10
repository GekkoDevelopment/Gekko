const { PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: { name: "ticketConfigSelect" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const value = interaction.values[0];
        if (value === 'ticketChannel') {
            const ticketChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId('ticketChannelSelect')
            .setChannelTypes('GuildText')
            .setPlaceholder('✧˚ · . Ticket Channels');

            const actionRow1 = new ActionRowBuilder().addComponents(ticketChannelSelect);

            const msg = '🔍 Select, or Search for a channel';
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
            
        }

        if (value === 'ticketCat') {
            const ticketCategorySelect = new ChannelSelectMenuBuilder()
            .setCustomId('ticketCategorySelect')
            .setChannelTypes('GuildCategory')
            .setPlaceholder('✧˚ · . Ticket Categories');

            const actionRow1 = new ActionRowBuilder().addComponents(ticketCategorySelect);

            const msg = '🔍 Select, or Search for a category';
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
        }

        if (value === 'supportRoles') {

            const supportRoleSelect = new RoleSelectMenuBuilder()
            .setCustomId('supportRoleSelect')
            .setMinValues(1)
            .setMaxValues(25)
            .setPlaceholder('✧˚ · . Select or Search for Roles');

            const actionRow1 = new ActionRowBuilder().addComponents(supportRoleSelect);

            const msg = '🔍 Select, or Search for roles';
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
        }

        if (value === 'disable') {
            MySQL.deleteRow('tickets', 'guild_id', interaction.guild.id);

            const disabledEmbed = embeds.get('featureDisabled')(interaction);
            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
        }
    }
}
