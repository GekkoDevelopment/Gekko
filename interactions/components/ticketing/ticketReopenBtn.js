import MySQL from '../../../models/mysql';

export default {
  data: { name: "ticketReopenBtn" },
  async execute(interaction) {
    const userId = await MySQL.getValueFromTableWithCondition(
      "ticket_data",
      "user_id",
      "ticket_id",
      `${interaction.channel.id}`
    );
    const user = interaction.guild.members.cache.get(userId.toString());
    const openEmbed = embeds.get("reopenedTicket")(interaction);

    const channel = interaction.channel;
    await channel.permissionOverwrites.edit(user, { ViewChannel: true });
    await interaction.message.delete();
    await channel.send({
      content: `<@${userId.toString()}>`,
      embeds: [openEmbed],
    });
  },
};
