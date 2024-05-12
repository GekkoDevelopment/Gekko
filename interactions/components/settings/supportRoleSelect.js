const MySQL = require("../../../models/mysql");

module.exports = {
  data: { name: "supportRoleSelect" },
  async execute(interaction) {
        const value = interaction.values;
        await MySQL.bulkInsertOrUpdate('tickets', ['guild_id', 'support_role_id'], [[interaction.guild.id, value.toString()]]);

        const formattedRoles = value.map((roleId) => `<@&${roleId}>`).join("\n");
        guildSupportRoles = `${formattedRoles}`

        const successEmbed = embeds.get('supportRoleSuccess')(interaction, {guildSupportRoles});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
