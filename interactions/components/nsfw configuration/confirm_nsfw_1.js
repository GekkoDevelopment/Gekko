import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  data: { name: "confirm_nsfw_1" },
  async execute(interaction) {
    await interaction.deferUpdate();

    const confirmButton2 = new ButtonBuilder()
      .setLabel("Yes")
      .setCustomId("confirm_nsfw_2")
      .setStyle(ButtonStyle.Success);
    const denyButton2 = new ButtonBuilder()
      .setLabel("No")
      .setCustomId("deny_nsfw_2")
      .setStyle(ButtonStyle.Danger);
    const actionRow2 = new ActionRowBuilder().addComponents(
      confirmButton2,
      denyButton2
    );
    const embedConfirmEmbed2 = embeds.get("nsfwConfirm2")(interaction);
    await interaction.message.edit({
      embeds: [embedConfirmEmbed2],
      components: [actionRow2],
    });
  },
};
