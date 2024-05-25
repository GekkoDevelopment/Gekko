import { SlashCommandBuilder, EmbedBuilder, DiscordAPIError } from "discord.js";
import MySQL from "../../../models/mysql.js";
import config from "../../../config.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("set-cash-amount")
    .setDescription("Set your starting cash amount for this server!")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The starting cash amount. (Limit is 99999)")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(99999)
    ),
  async execute(interaction) {
    const startingAmount = interaction.options.getInteger("amount");
    const guildId = interaction.member.guild.id;

    /*const loggingChannel = MySQL.getColumnValuesWithGuildId(
      guildId,
      "logging_channel"
    );
    const channel = interaction.guild.channels.cache.get(
      loggingChannel.toString()
    );*/

    // Need to set up economy logging for audit log settings.

    DiscordExtensions.checkIfRestricted(interaction);

    MySQL.updateValueInTableWithCondition(
      "guilds",
      "starting_amount",
      startingAmount,
      "guild_id",
      guildId
    );

    const embed = new EmbedBuilder()
      .setDescription(
        `Success! Your starting amount is now set to ${startingAmount}`
      )
      .setColor("Green");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
