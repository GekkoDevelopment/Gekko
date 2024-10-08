import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("bug-report")
    .setDescription("Submit a bug-report to the Gekko"),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);
    
    try {
      const bugModal = new ModalBuilder()
        .setCustomId("bug_report_modal")
        .setTitle("Bug Description");
      const bugModalDescInput = new TextInputBuilder()
        .setCustomId("bug_desc_input")
        .setLabel("Bug Description")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(3)
        .setMaxLength(3000)
        .setRequired(true);

      const bugModalVidInput = new TextInputBuilder()
        .setCustomId("bug_vid_input")
        .setLabel("Video (if available)")
        .setStyle(TextInputStyle.Short)
        .setMinLength(7)
        .setMaxLength(100)
        .setRequired(false);

      const bugModalDesc = new ActionRowBuilder().addComponents(
        bugModalDescInput
      );
      const bugModalVid = new ActionRowBuilder().addComponents(
        bugModalVidInput
      );

      bugModal.addComponents(bugModalDesc);
      bugModal.addComponents(bugModalVid);

      await interaction.showModal(bugModal);

    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
        errorMessage,
        errorDescription,
      });
      await interaction.channel.send({
        embeds: [catchErrorEmbed],
        ephemeral: true,
      });
    }
  },
};
