import { PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql';

module.exports = {
  data: { name: "nsfwConfigSelect" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const value = interaction.values[0];

        if (value === 'disable') {
            MySQL.editColumnInGuilds(interaction.guild.id, 'nsfw_enabled', 'false');

            const disabledEmbed = embeds.get('featureDisabled')(interaction);
            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
        }
    }
}
