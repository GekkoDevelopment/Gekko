import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

module.exports = {
  data: { name: "ticketCreateBtn" },
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("ticketModal")
      .setTitle("Support Ticket");

    const topicInput = new TextInputBuilder()
      .setCustomId("topic")
      .setLabel("Topic")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("What is the topic of your issue?")
      .setRequired(true);

    const issueInput = new TextInputBuilder()
      .setCustomId("issue")
      .setLabel("issue")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Please provide us with some background information")
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(topicInput);
    const seconActionRow = new ActionRowBuilder().addComponents(issueInput);

    modal.addComponents(firstActionRow, seconActionRow);
    await interaction.showModal(modal);
  },
};
