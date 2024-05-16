import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import fetch from 'node-fetch';
import colors from '../../../models/colors.js';

export default {
  data: new SlashCommandBuilder()
    .setName("anime-quote")
    .setDescription("Get a random Anime Quote."),
  async execute(interaction) {
    const restricted = MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      interaction.guild.id
    );

    if (restricted === "true") {
      const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    try {
      const response = await fetch("https://animechan.xyz/api/random");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const quote = await response.json();
      const colorsArray = Object.entries(colors);
      const randomColorIndex = Math.floor(Math.random() * colorsArray.length);
      const randomColor = colorsArray[randomColorIndex][1];
      const embed = new EmbedBuilder().setColor(randomColor).addFields(
        {
          name: "<:keqingheart:1228074361311858810> Anime Quote:",
          value: `\`\`\`\n${quote.quote}\`\`\``,
          inline: false,
        },
        {
          name: "Anime:",
          value: `${quote.anime}`,
          inline: true,
        },
        {
          name: "Character:",
          value: `${quote.character}`,
          inline: true,
        }
      );

      await interaction.reply({ embeds: [embed] });
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
