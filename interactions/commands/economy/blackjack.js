import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("Start a game of blackjack.")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription('The amount to "bet".')
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);
  },
};
