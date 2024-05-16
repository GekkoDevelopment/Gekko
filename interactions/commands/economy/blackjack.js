import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import MySQL from '../../../models/mysql';
import colors from '../../../models/colors';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("Start a game of blackjack.")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription('The amount to "bet".')
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
  },
};
