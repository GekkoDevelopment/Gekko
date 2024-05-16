import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import config from '../../../config.js';

export default {
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
