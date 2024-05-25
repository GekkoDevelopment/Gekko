import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import fetch from 'node-fetch';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Kiss another user!")
    .addUserOption((option) =>
      option.setName("user").setDescription("choose a user").setRequired(true)
    ),
  async execute(interaction) {
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
        nsfwEnabled === "false" ||
        (nsfwEnabled === "false" && interaction.channel.nsfw)
      ) {
        return await interaction.editReply({
          content:
            "You must have NSFW enabled to use this feature (Contact your server administrator to change this.)",
          ephemeral: true,
        });
      }

      const response = await fetch("https://api.waifu.pics/sfw/kiss");

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const user = interaction.options.getUser("user");
      const data = await response.json();
      const content = `<@${user.id}>`;

      const embed = new EmbedBuilder()
        .setTitle("Here's a kiss!")
        .setDescription(`<@${interaction.user.id}> kissed <@${user.id}>`)
        .setColor(colors.bot)
        .setImage(`${data.url}`);

      await interaction.editReply({ content: content, embeds: [embed] });
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
