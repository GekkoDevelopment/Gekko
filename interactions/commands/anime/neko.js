import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import colors from "../../../models/colors.js";
import MySQL from "../../../models/mysql.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("neko")
    .setDescription("Random neko generator!")
    .addBooleanOption((option) =>
      option
        .setName("nsfw")
        .setDescription(
          "Send an NSFW image (need to have NSFW features turned on in order to do this.)"
        )
    ),
  async execute(interaction) {
    const isNsfw = interaction.options.getBoolean("nsfw");
    const guildId = interaction.guild.id;

    const dbPromise = MySQL.getValueFromTableWithCondition(
      "guilds",
      "nsfw_enabled",
      "guild_id",
      guildId
    );
    
    const nsfwEnabled = await dbPromise;
    DiscordExtensions.checkIfRestricted(interaction);

    try {
      await interaction.deferReply();

      if (!interaction.channel.nsfw && isNsfw) {
        return await interaction.editReply({
          content: "NSFW can only be used in NSFW channels.",
          ephemeral: true,
        });
      }

      if (
        (nsfwEnabled === "false" && isNsfw) ||
        (nsfwEnabled === "false" && interaction.channel.nsfw && isNsfw)
      ) {
        return await interaction.editReply({
          content:
            "You must have NSFW enabled to use this feature (Contact your server administrator to change this.)",
          ephemeral: true,
        });
      }

      const response = await fetch(
        isNsfw
          ? "https://api.waifu.pics/nsfw/neko"
          : "https://api.waifu.pics/sfw/neko"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();

      const embed = new EmbedBuilder()
        .setTitle("Waifu!")
        .setColor(colors.bot)
        .setImage(`${data.url}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
        errorMessage,
        errorDescription,
      });
      await interaction.editReply({
        embeds: [catchErrorEmbed],
        ephemeral: true,
      });
    }
  },
};
