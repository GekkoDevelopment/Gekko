const MySQL = require("../../../models/mysql");

module.exports = {
  data: { name: "ticketChannelSelect" },
  async execute(interaction) {
        const value = interaction.values[0];
        await MySQL.bulkInsertOrUpdate('tickets', ['guild_id', 'ticket_channel_id'], [[interaction.guild.id, value]]);

        const successEmbed = embeds.get('ticketChannelSuccess')(interaction, {value});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
