import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, ButtonStyle } from "discord.js";
import MySQL from "../../../models/mysql.js";
import colors from "../../../models/colors.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("launch-tickets")
    .setDescription("Launch your ticketing configuration")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    const embed = new EmbedBuilder()
      .setTitle("Contact Support")
      .setDescription(
        "Create a ticket and contact the support team with the button below."
      )
      .setColor(colors.bot);

    const ticketBtn = new ButtonBuilder()
      .setCustomId("ticketCreateBtn")
      .setLabel("Create a Ticket")
      .setEmoji("📩")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(ticketBtn);

    const ticketChannelId = await MySQL.getValueFromTableWithCondition('tickets', 'ticket_Channel_id', 'guild_id', interaction.guild.id);
    const ticketChannel = interaction.guild.channels.cache.get(ticketChannelId);

    const successEmbed = new EmbedBuilder()
      .setTitle("Ticket Setup Launched")
      .setDescription(`> Ticketing Embed has been sent to ${ticketChannel}`)
      .setColor("Green")
      .setTimestamp();

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    await ticketChannel.send({ embeds: [embed], components: [row] });
  },
};
