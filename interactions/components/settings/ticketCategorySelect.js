import MySQL from '../../../models/mysql.js';

export default {
  data: { name: "ticketCategorySelect" },
  async execute(interaction) {
        const value = interaction.values[0];
        await MySQL.bulkInsertOrUpdate('tickets', ['guild_id', 'ticket_category'], [[interaction.guild.id, value]]);

        const successEmbed = embeds.get('ticketCategorySuccess')(interaction, {value});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
