const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const MySQL = require("../models/mysql");
const config = require("../config");

module.exports = {
  name: Events.GuildScheduledEventUpdate,
  async execute(oldEvent, newEvent) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      newEvent.guild.id
    );

    if (logChannelId) {
      const logChannel = newEvent.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await newEvent.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildScheduledEventCreate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;

      if (oldEvent.name !== newEvent.name) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Name:",
              value: `${oldEvent.name}`,
              inline: true,
            },
            {
              name: "New Name:",
              value: `${newEvent.name}`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Event Name Updated`)
          .setDescription(
            `> **Event Name:** ${newEvent.name} \n> **Where:** <#${
              newEvent.channelId
            }> \n> **When:** <t:${Math.floor(
              newEvent.scheduledStartTimestamp / 1000
            )}:R> \n> **Created by:** <@${
              executor.id
            }> \n> \n> **Event Description:** \n> ${newEvent.description}`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newEvent.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }

      if (oldEvent.channelId !== newEvent.channelId) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Location:",
              value: `<#${oldEvent.channelId}>`,
              inline: true,
            },
            {
              name: "New Location:",
              value: `<#${newEvent.channelId}>`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Event Location Updated`)
          .setDescription(
            `> **Event Name:** ${newEvent.name} \n> **Where:** <#${
              newEvent.channelId
            }> \n> **When:** <t:${Math.floor(
              newEvent.scheduledStartTimestamp / 1000
            )}:R> \n> **Created by:** <@${
              executor.id
            }> \n> \n> **Event Description:** \n> ${newEvent.description}`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newEvent.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }

      if (oldEvent.scheduledStartTimestamp !== newEvent.scheduledStartTimestamp) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Start Time:",
              value: `<t:${Math.floor(
                oldEvent.scheduledStartTimestamp / 1000
              )}:F>`,
              inline: true,
            },
            {
              name: "New Start Time:",
              value: `<t:${Math.floor(
                newEvent.scheduledStartTimestamp / 1000
              )}:F>`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Event times Updated`)
          .setDescription(
            `> **Event Name:** ${newEvent.name} \n> **Where:** <#${
              newEvent.channelId
            }> \n> **When:** <t:${Math.floor(
              newEvent.scheduledStartTimestamp / 1000
            )}:R> \n> **Created by:** <@${
              executor.id
            }> \n> \n> **Event Description:** \n> ${newEvent.description}`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newEvent.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }

      if (oldEvent.description !== newEvent.description) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Description:",
              value: `${oldEvent.description}`,
              inline: true,
            },
            {
              name: "New Description:",
              value: `${newEvent.description}`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Event Description Updated`)
          .setDescription(
            `> **Event Name:** ${newEvent.name} \n> **Where:** <#${
              newEvent.channelId
            }> \n> **When:** <t:${Math.floor(
              newEvent.scheduledStartTimestamp / 1000
            )}:R> \n> **Created by:** <@${
              executor.id
            }> \n> \n> **Event Description:** \n> ${newEvent.description}`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newEvent.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }
    } else {
      return;
    }
  },
};
