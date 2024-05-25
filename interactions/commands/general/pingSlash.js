import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("View Gekkō's current latency."),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
    const pingEmbed = new EmbedBuilder()
      .setTitle("🏓 Gekkō's Latency Data")
      .setDescription(
        `> ***Latency:*** \n> \`${timeDiff}ms\` \n\n> ***API Latency:*** \n> \`${Math.round(
          interaction.client.ws.ping
        )}ms\``
      )
      .setColor(colors.bot)
      .setFooter({
        text: "Gekko",
        iconURL: interaction.client.user.avatarURL(),
      });
    interaction.editReply({ content: " ", embeds: [pingEmbed] });
  },
};
