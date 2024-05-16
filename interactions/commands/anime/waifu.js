import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import colors from '../../../models/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("waifu")
    .setDescription("Random waifu generator!")
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
      await interaction.deferReply();

      if (!interaction.channel.nsfw && isNsfw) {
        return await interaction.editReply({
          content: "NSFW Commands can only be used in NSFW channels.",
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
          ? "https://api.waifu.pics/nsfw/waifu"
          : "https://api.waifu.pics/sfw/waifu"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();

      const embed = new EmbedBuilder()
        .setTitle("Waifu!")
        .setColor(colors.bot)
        .setImage(`${data.url}`);

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
      await interaction.editReply({
        embeds: [catchErrorEmbed],
        ephemeral: true,
      });
    }
  },
};
