const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  ButtonStyle,
} = require("discord.js");
const colors = require("../../../models/colors");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-tickets")
    .setDescription("Configure Ticketing system in your guild")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select a ticketing Channel")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("ticket-category")
        .setDescription("Where will tickets open?")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("support-role")
        .setDescription("Chose a support Role")
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const ticketChannel = interaction.options.getChannel("channel");
    const ticketCategory = interaction.options.getChannel("ticket-category");
    const supportRole = interaction.options.getRole("support-role");

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

    await MySQL.bulkInsertOrUpdate(
      "tickets",
      ["guild_id", "ticket_channel_id", "ticket_category", "support_role_id"],
      [[guildId, ticketChannel.id, ticketCategory.id, supportRole.id]]
    );

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

    const successEmbed = new EmbedBuilder()
      .setTitle("Ticket Channel Set")
      .setDescription(`> Ticketing Embed has been sent to ${ticketChannel}`)
      .setColor("Green")
      .setTimestamp();

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    await ticketChannel.send({ embeds: [embed], components: [row] });
  },
};
