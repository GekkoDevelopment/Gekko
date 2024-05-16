import { PermissionFlagsBits, ActionRowBuilder, RoleSelectMenuBuilder } from 'discord.js';
import MySQL from '../../../models/mysql';

export default {
  data: { name: "joinConfigSelect" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const value = interaction.values[0];
        if (value === 'joinRoles') {
            const joinRoleSelect = new RoleSelectMenuBuilder()
            .setCustomId('joinRoleSelect')
            .setMinValues(1)
            .setMaxValues(25)
            .setPlaceholder('✧˚ · . Select or Search for Roles');

            const actionRow1 = new ActionRowBuilder().addComponents(joinRoleSelect);

            const msg = '🔍 Select, or Search for a role';
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
            
        }

        if (value === 'disable') {
            MySQL.editColumnInGuilds(interaction.guild.id, 'join_role', null);

            const disabledEmbed = embeds.get('featureDisabled')(interaction);
            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
        }
    }
}
