import { EmbedBuilder } from "discord.js";

export default {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Created")
      .setDescription(`> I have created a ticket for you at ${data.channel}`)
      .setColor("Green")
      .setTimestamp(),
};
