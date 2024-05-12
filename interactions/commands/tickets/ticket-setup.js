const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  ButtonStyle,
} = require("discord.js");
const MySQL = require("../../../models/mysql");
const colors = require("../../../models/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("launch-tickets")
    .setDescription("Launch your ticketing configuration")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
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
