const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");
const config = require("../../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("soft-ban")
    .setDescription(
      "Softban a member (ban and immediately unban to delete their messages)."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to softban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason to softban the user.")
    ),
  async execute(interaction) {},
};
