import { EmbedBuilder } from "discord.js";
import colors from "../../models/colors";

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Panel")
      .setDescription("Use the buttons below to manage this ticket.")
      .setTimestamp()
      .setColor(colors.bot),
};
