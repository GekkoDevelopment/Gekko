import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config';

export default {
  name: Events.GuildScheduledEventCreate,
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
        .setTitle(`${config.emojis.warning} Event Created`)
        .setDescription(
          `> **Event Name:** ${event.name} \n> **Where:** <#${
            event.channelId
          }> \n> **When:** <t:${Math.floor(
            event.scheduledStartTimestamp / 1000
          )}:R> \n> **Created by:** <@${
            executor.id
          }> \n> \n> **Event Description:** \n> ${event.description}`
        )
        .setColor("Green")
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
