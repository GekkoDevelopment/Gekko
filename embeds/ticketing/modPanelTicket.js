import { EmbedBuilder } from "discord.js";
import colors from "../../models/colors";

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Panel")
      .setDescription("Use the buttons below to manage this ticket.")
      .setTimestamp()
      .setColor(colors.bot),
};
