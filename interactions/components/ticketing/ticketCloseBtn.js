import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import MySQL from '../../../models/mysql.js';

export default {
  data: { name: "ticketCloseBtn" },
  async execute(interaction) {
    await interaction.deferUpdate();
    const modPanel = embeds.get("modPanelTicket")(interaction);
    const ticketClosed = embeds.get("closedTicket")(interaction);

    const channel = interaction.channel;
    const userId = await MySQL.getValueFromTableWithCondition(
      "ticket_data",
      "user_id",
      "ticket_id",
      `${channel.id}`
    );
    const user = interaction.guild.members.cache.get(userId.toString());

    const reopenBtn = new ButtonBuilder()
      .setCustomId("ticketReopenBtn")
      .setLabel("Reopen Ticket")
      .setStyle(ButtonStyle.Primary);

    const deleteBtn = new ButtonBuilder()
      .setCustomId("ticketDeleteBtn")
      .setLabel("Delete Ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(reopenBtn, deleteBtn);

    await channel.permissionOverwrites.delete(user);
    await channel.send({ embeds: [ticketClosed] });
    await channel.send({ embeds: [modPanel], components: [row] });
  },
};
