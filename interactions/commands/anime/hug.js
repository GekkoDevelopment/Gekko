const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const colors = require("../../../models/colors");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Hug another user!")
    .addUserOption((option) =>
      option.setName("user").setDescription("choose a user").setRequired(true)
    ),
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
