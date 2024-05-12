const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const MySQL = require("../models/mysql");
const config = require("../config");

module.exports = {
  name: Events.GuildScheduledEventDelete,
  async execute(event) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      event.guild.id
    );

    if (logChannelId) {
      const logChannel = event.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await event.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildScheduledEventCreate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) return;

      const executor = firstEntry.executor;

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Event Deleted`)
        .setDescription(
          `> **Event Name:** ${event.name} \n> **Where:** <#${
            event.channelId
          }> \n> **When:** <t:${Math.floor(
            event.scheduledStartTimestamp / 1000
          )}:R> \n> **Deleted by:** <@${
            executor.id
          }> \n> \n> **Event Description:** \n> ${event.description}`
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: event.client.user.displayAvatarURL(),
        });
      await logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  },
};
