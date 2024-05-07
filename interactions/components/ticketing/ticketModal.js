const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const MySQL = require("../../../models/mysql");
const delay = require("node:timers/promises").setTimeout;

module.exports = {
  data: { name: "ticketModal" },
  async execute(interaction) {
    const topic = interaction.fields.getTextInputValue("topic");
    const issue = interaction.fields.getTextInputValue("issue");

    const embed = embeds.get("memberCreatedTicket")(interaction, {
      topic,
      issue,
    });

    const closeBtn = new ButtonBuilder()
      .setEmoji("🔒")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("ticketCloseBtn");

    let channel = await interaction.guild.channels.create({
      name: `ticket-for-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: "1226502621431599114", // We can use MySql to store and retrieve data so that users can configure there own ticketing system.
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: "1226502588124496006", // Lead Devs
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: "1226502589412016201", // Admins. Again, we can use a database to allow user configuation.
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    const guild = interaction.guild.id;
    const user = interaction.user.id;
    const row = new ActionRowBuilder().addComponents(closeBtn);

    const data = {
      guild_id: guild,
      ticket_id: channel.id,
      user_id: user,
    };

    await MySQL.insertRow("ticket_data", data);

    delay(1000);
    await channel.send({
      content: "@<&1226502589412016201> @<&1226502588124496006>",
      embeds: [embed],
      components: [row],
    });
    const successEmbed = embeds.get("memberSuccessTicket")(interaction, {
      channel,
    });
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  },
};
