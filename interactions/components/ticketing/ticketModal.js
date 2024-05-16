import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql';
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

    const supportRole = await MySQL.getValueFromTableWithCondition('tickets', 'support_role_id', 'guild_id', interaction.guild.id);
    const roleIdsArray = supportRole.split(",");
    const ticketCategory = await MySQL.getValueFromTableWithCondition('tickets', 'ticket_category', 'guild_id', interaction.guild.id);

    let permissionOverwrites = [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ];
    
    for (const roleId of roleIdsArray) {
      permissionOverwrites.push({
        id: roleId,
        allow: [PermissionsBitField.Flags.ViewChannel],
      });
    }
    
    let channel = await interaction.guild.channels.create({
      name: `ticket-for-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: ticketCategory,
      permissionOverwrites: permissionOverwrites,
    });

    const guild = interaction.guild.id;
    const user = interaction.user.id;
    const row = new ActionRowBuilder().addComponents(closeBtn);
    const formattedRoles = roleIdsArray.map((roleId) => `<@&${roleId}>`).join(", ");

    const data = {
      guild_id: guild,
      ticket_id: channel.id,
      user_id: user,
    };

    await MySQL.insertRow("ticket_data", data);

    delay(1000);
    await channel.send({
      content: formattedRoles,
      embeds: [embed],
      components: [row],
    });
    const successEmbed = embeds.get("memberSuccessTicket")(interaction, {
      channel,
    });
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  },
};
