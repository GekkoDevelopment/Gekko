const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    const loggingType = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_type",
      "guild_id",
      message.guild.id
    );

    if (!loggingType) {
      return;
    } else if (
      loggingType === "all" ||
      loggingType === "auditLogging" ||
      loggingType === "message"
    ) {
      const logChannelId = await MySQL.getValueFromTableWithCondition(
        "guilds",
        "logging_channel",
        "guild_id",
        message.guild.id
      );
      const logChannel = message.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
      });

      if (!logChannel) {
        console.log(`${logChannelId} not found.`);
        return;
      }

      if (message.content) {
        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Message Deleted`)
          .setDescription(
            `> **Channel:** ${message.channel} (||${message.channel.id}||) \n> **Message ID:** ${message.id} \n> **Message Author:** <@${message.author.id}>`
          )
          .addFields(
            {
              name: "Message Content:",
              value: `\`\`\`${message.content}\`\`\``,
            },
          )
          .setColor("Red")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: message.client.user.displayAvatarURL(),
          });

        await logChannel.send({ embeds: [embed] });
      }
      if (!message.content) {
        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Message Deleted`)
          .setDescription(
            `> **Channel:** ${message.channel} (||${message.channel.id}||) \n> **Message ID:** ${message.id} \n> **Message Author:** <@${message.author.id}>`
          )
          .addFields(
            {
              name: "Embed Content:",
              value: `\`\`\`Message was an Embed, we can't embed an embed within an embed.\`\`\``,
            },
          )
          .setColor("Red")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: message.client.user.displayAvatarURL(),
          });

        await logChannel.send({ embeds: [embed] });
      }
    }
  },
};
