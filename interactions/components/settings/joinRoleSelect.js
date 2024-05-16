import MySQL from '../../../models/mysql';

export default {
  data: { name: "joinRoleSelect" },
  async execute(interaction) {
        const value = interaction.values;
        await MySQL.editColumnInGuilds(interaction.guild.id, "join_role", value.toString());

        const formattedRoles = value.map((roleId) => `<@&${roleId}>`).join("\n");
        guildJoinRoles = `${formattedRoles}`

        const successEmbed = embeds.get('joinRoleSuccess')(interaction, {guildJoinRoles});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
