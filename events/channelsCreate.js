import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql'
import config from '../config';

module.exports = {
  name: Events.ChannelCreate,
  async execute(channel) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      channel.guild.id
    );

    if (logChannelId) {
      const logChannel = channel.guild.channels.cache.get(logChannelId);

      if (channel.type === 0) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Text Channel Created`)
          .setDescription(
            `> **Channel Name:** <#${channel.id}> (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(executor.displayAvatarURL())
          .setFooter({
            text: "Gekkō",
            iconURL: channel.client.user.displayAvatarURL(),
          });

        logChannel.send({ embeds: [embed] });
      }

      if (channel.type === 2) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Voice Channel Created`)
          .setDescription(
            `> **Channel Name:** <#${channel.id}> (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Rtc Region:** ${channel.rtcRegion} \n> **Bit Rate:** ${channel.bitrate} \n> **User Limit:** ${channel.userLimit} \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(executor.displayAvatarURL())
          .setFooter({
            text: "Gekkō",
            iconURL: channel.client.user.displayAvatarURL(),
          });

        logChannel.send({ embeds: [embed] });
      }

      if (channel.type === 15) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Forum Channel Created`)
          .setDescription(
            `> **Channel Name:** <#${channel.id}> (||${
              channel.id
            }||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${
              channel.nsfw
            } \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${
              channel.rawPosition
            } \n> **Channel Tags:** ${
              channel.availableTags
            } \n> **Channel Default Emoji:** ${
              channel.defaultReactEmoji || "None"
            } \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(executor.displayAvatarURL())
          .setFooter({
            text: "Gekkō",
            iconURL: channel.client.user.displayAvatarURL(),
          });

        logChannel.send({ embeds: [embed] });
      }

      if (channel.type === 5) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Announcement Channel Created`)
          .setDescription(
            `> **Channel Name:** <#${channel.id}> (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(executor.displayAvatarURL())
          .setFooter({
            text: "Gekkō",
            iconURL: channel.client.user.displayAvatarURL(),
          });

        logChannel.send({ embeds: [embed] });
      }

      if (channel.type === 13) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Stage Channel Created`)
          .setDescription(
            `> **Channel Name:** <#${channel.id}> (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Rtc Region:** ${channel.rtcRegion} \n> **Bit Rate:** ${channel.bitrate} \n> **User Limit:** ${channel.userLimit} \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(executor.displayAvatarURL())
          .setFooter({
            text: "Gekkō",
            iconURL: channel.client.user.displayAvatarURL(),
          });

        logChannel.send({ embeds: [embed] });
      }
    } else {
      return;
    }
  },
};
