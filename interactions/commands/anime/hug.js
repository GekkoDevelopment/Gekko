import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Hug another user!")
    .addUserOption((option) =>
      option.setName("user").setDescription("choose a user").setRequired(true)
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    try {
      const user = interaction.options.getUser("user");
      const response = await fetch("https://api.waifu.pics/sfw/hug");
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const data = await response.json();
      const content = `<@${user.id}>`;
      const embed = new EmbedBuilder()
        .setTitle("Here's a hug!")
        .setDescription(`<@${interaction.user.id}> hugged <@${user.id}>`)
        .setColor(colors.bot)
        .setImage(`${data.url}`);

      await interaction.reply({ content: content, embeds: [embed] });
    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
        errorMessage,
        errorDescription,
      });
      await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
    }
  },
};
