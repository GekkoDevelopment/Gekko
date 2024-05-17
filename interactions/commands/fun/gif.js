import { SlashCommandBuilder } from "discord.js";
import MySQL from "../../../models/mysql.js";
import config from "../../../config.js";
import superagent from 'superagent';
import DiscordExtensions from "../../../models/DiscordExtensions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Get a random GIF.")
    .addStringOption((option) =>
      option
        .setName("term")
        .setDescription("The search term you want your meme to have.")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const { options } = interaction;

    DiscordExtensions.checkIfRestricted(interaction);

    const query = options.getString("term");
    const apiKey = config.apiKeys.tenorApi;
    const clientKey = "Gekko";
    const lmt = 8;

    let choice = Math.floor(Math.random() * lmt);

    const link = `https://tenor.googleapis.com/v2/search?q=${query}&key=${apiKey}&client_key=${clientKey}&limit=${lmt}`;

    try {
      const response = await superagent.get(link);
      if (
        response &&
        response.body &&
        response.body.results &&
        response.body.results.length > 0
      ) {
        await interaction.editReply({
          content: response.body.results[choice].itemurl,
        });
      } else {
        throw new Error("No results found");
      }
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
