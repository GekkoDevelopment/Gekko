import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import colors from "../../../models/colors.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random meme."),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    async function meme() {
      try {
        const response = await fetch(
          "https://www.reddit.com/r/memes/random.json"
        );
        const data = await response.json();

        if (
          !data[0] ||
          !data[0].data ||
          !data[0].data.children ||
          data[0].data.children.length === 0
        ) {
          throw new Error("No meme found.");
        }

        const memeData = data[0].data.children[0].data;
        const title = memeData.title;
        const image = memeData.url;
        const author = memeData.author;

        const embed = new EmbedBuilder()
          .setTitle(`${title}`)
          .setImage(`${image}`)
          .setURL(`${image}`)
          .setColor(colors.bot)
          .setURL(`https://www.reddit.com${memeData.permalink}`)
          .setFooter({ text: `Posted by ${author}` });

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
    }

    meme();
  },
};
