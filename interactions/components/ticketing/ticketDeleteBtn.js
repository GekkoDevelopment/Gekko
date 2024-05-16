import MySQL from '../../../models/mysql.js';

export default {
  data: { name: "ticketDeleteBtn" },
  async execute(interaction) {
    const deletionEmbed = embeds.get("deletingTicket")(interaction);

    await interaction.channel.send({ embeds: [deletionEmbed] });
    await interaction.deferUpdate();
    MySQL.deleteRow("ticket_data", "ticket_id", `${interaction.channel.id}`);

    setTimeout(() => {
      interaction.channel.delete();
    }, 5000);
  },
};
