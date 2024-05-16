import { EmbedBuilder } from 'discord.js';

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle("Ticket Opened")
      .setDescription(
        "Ticket Created, please wait for a staff member to respond."
      )
      .setTimestamp()
      .setFooter({ text: `Ticket Created At:` })
      .addFields(
        {
          name: "User",
          value: `\`\`\`${interaction.user.username}\`\`\``,
          inline: false,
        },
        {
          name: "Topic",
          value: `\`\`\`${data.topic}\`\`\``,
          inline: false,
        },
        {
          name: "Issue",
          value: `\`\`\`${data.issue}\`\`\``,
          inline: false,
        }
      ),
};
