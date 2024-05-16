import { EmbedBuilder } from "discord.js";
import colors from "../../models/colors.js";

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Reopened")
      .setDescription(`> <@${interaction.user.id}> has reopened this ticket.`)
      .setColor(colors.bot)
      .setTimestamp(),
};
