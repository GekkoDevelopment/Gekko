import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql'
import config from '../config';

export default {
  name: Events.ChannelUpdate,
  async execute(oldChannel, newChannel) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      newChannel.guild.id
    );

    if (logChannelId) {
      const logChannel = newChannel.guild.channels.cache.get(logChannelId);        

      ////// TEXT CHANNELS //////
      if (newChannel.type === 0) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelUpdate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
          return;
        }

        const executor = firstEntry.executor;

        if (oldChannel.name !== newChannel.name) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Name:",
                value: `${oldChannel.name}`,
                inline: true,
              },
              {
                name: "New Name:",
                value: `${newChannel.name}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Text Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous NSFW Status:",
                value: `${oldChannel.nsfw}`,
                inline: true,
              },
              {
                name: "New NSFW Status:",
                value: `${newChannel.nsfw}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Text Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.parentId !== newChannel.parentId) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Category:",
                value: `<#${oldChannel.parentId}>`,
                inline: true,
              },
              {
                name: "New Category:",
                value: `<#${newChannel.parentId}>`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Text Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.topic !== newChannel.topic) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Topic:",
                value: oldChannel.topic ? oldChannel.topic.toString() : "None",
                inline: true,
              },
              {
                name: "New Topic:",
                value: newChannel.topic ? newChannel.topic.toString() : "None",
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Text Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Slowmode:",
                value: `${oldChannel.rateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Slowmode:",
                value: `${newChannel.rateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Text Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }
      }

      ////// VOICE CHANNELS //////
      if (newChannel.type === 2) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

        const executor = firstEntry.executor;

        if (oldChannel.name !== newChannel.name) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Name:",
                value: `${oldChannel.name}`,
                inline: true,
              },
              {
                name: "New Name:",
                value: `${newChannel.name}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous NSFW Status:",
                value: `${oldChannel.nsfw}`,
                inline: true,
              },
              {
                name: "New NSFW Status:",
                value: `${newChannel.nsfw}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.parentId !== newChannel.parentId) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Category:",
                value: `<#${oldChannel.parentId}>`,
                inline: true,
              },
              {
                name: "New Category:",
                value: `<#${newChannel.parentId}>`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Slowmode:",
                value: `${oldChannel.rateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Slowmode:",
                value: `${newChannel.rateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.bitrate !== newChannel.bitrate) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Bitrate:",
                value: `${oldChannel.bitrate}kbps`,
                inline: true,
              },
              {
                name: "New Bitrate:",
                value: `${newChannel.bitrate}kbps`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Region Override:",
                value: `${oldChannel.rtcRegion}`,
                inline: true,
              },
              {
                name: "New Region Override:",
                value: `${newChannel.rtcRegion}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.userLimit !== newChannel.userLimit) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous User Limit:",
                value: `${oldChannel.userLimit}`,
                inline: true,
              },
              {
                name: "New User Limit:",
                value: `${newChannel.userLimit}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Voice Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }
      }

      ////// FORUM CHANNELS //////
      if (newChannel.type === 15) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

        const executor = firstEntry.executor;
        if (oldChannel.name !== newChannel.name) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Name:",
                value: `${oldChannel.name}`,
                inline: true,
              },
              {
                name: "New Name:",
                value: `${newChannel.name}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous NSFW Status:",
                value: `${oldChannel.nsfw}`,
                inline: true,
              },
              {
                name: "New NSFW Status:",
                value: `${newChannel.nsfw}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.parentId !== newChannel.parentId) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Category:",
                value: `<#${oldChannel.parentId}>`,
                inline: true,
              },
              {
                name: "New Category:",
                value: `<#${newChannel.parentId}>`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.availableTags !== newChannel.availableTags) {
          const oldTags =
            oldChannel.availableTags.length > 0
              ? oldChannel.availableTags.map((tag) => `${tag.name}`).join(", ")
              : "None";
          const newTags =
            newChannel.availableTags.length > 0
              ? newChannel.availableTags.map((tag) => `${tag.name}`).join(", ")
              : "None";

          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Tags:",
                value: oldTags,
                inline: true,
              },
              {
                name: "New Tags:",
                value: newTags,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.topic !== newChannel.topic) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Topic:",
                value: oldChannel.topic ? oldChannel.topic.toString() : "None",
                inline: true,
              },
              {
                name: "New Topic:",
                value: newChannel.topic ? newChannel.topic.toString() : "None",
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (
          oldChannel.defaultThreadRateLimitPerUser !==
          newChannel.defaultThreadRateLimitPerUser
        ) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Message Slowmode:",
                value: `${oldChannel.defaultThreadRateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Message Slowmode:",
                value: `${newChannel.defaultThreadRateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Thread Slowmode:",
                value: `${oldChannel.rateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Thread Slowmode:",
                value: `${newChannel.rateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Forum Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }
      }

      ////// ANNOUNCEMENT CHANNELS //////
      if (newChannel.type === 5) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

        const executor = firstEntry.executor;

        if (oldChannel.name !== newChannel.name) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Name:",
                value: `${oldChannel.name}`,
                inline: true,
              },
              {
                name: "New Name:",
                value: `${newChannel.name}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Announcement Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous NSFW Status:",
                value: `${oldChannel.nsfw}`,
                inline: true,
              },
              {
                name: "New NSFW Status:",
                value: `${newChannel.nsfw}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Announcement Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.parentId !== newChannel.parentId) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Category:",
                value: `<#${oldChannel.parentId}>`,
                inline: true,
              },
              {
                name: "New Category:",
                value: `<#${newChannel.parentId}>`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Announcement Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.topic !== newChannel.topic) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Topic:",
                value: oldChannel.topic ? oldChannel.topic.toString() : "None",
                inline: true,
              },
              {
                name: "New Topic:",
                value: newChannel.topic ? newChannel.topic.toString() : "None",
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Announcement Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Slowmode:",
                value: `${oldChannel.rateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Slowmode:",
                value: `${newChannel.rateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Announcement Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }
      }

      ////// STAGE CHANNELS //////
      if (newChannel.type === 13) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
          limit: 1,
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

        const executor = firstEntry.executor;
        if (oldChannel.name !== newChannel.name) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Name:",
                value: `${oldChannel.name}`,
                inline: true,
              },
              {
                name: "New Name:",
                value: `${newChannel.name}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.nsfw !== newChannel.nsfw) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous NSFW Status:",
                value: `${oldChannel.nsfw}`,
                inline: true,
              },
              {
                name: "New NSFW Status:",
                value: `${newChannel.nsfw}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.parentId !== newChannel.parentId) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Category:",
                value: `<#${oldChannel.parentId}>`,
                inline: true,
              },
              {
                name: "New Category:",
                value: `<#${newChannel.parentId}>`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Slowmode:",
                value: `${oldChannel.rateLimitPerUser} Seconds`,
                inline: true,
              },
              {
                name: "New Slowmode:",
                value: `${newChannel.rateLimitPerUser} Seconds`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.bitrate !== newChannel.bitrate) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Bitrate:",
                value: `${oldChannel.bitrate}kbps`,
                inline: true,
              },
              {
                name: "New Bitrate:",
                value: `${newChannel.bitrate}kbps`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous Region Override:",
                value: `${oldChannel.rtcRegion}`,
                inline: true,
              },
              {
                name: "New Region Override:",
                value: `${newChannel.rtcRegion}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.userLimit !== newChannel.userLimit) {
          const embed = new EmbedBuilder();
          embed
            .addFields(
              {
                name: "Previous User Limit:",
                value: `${oldChannel.userLimit}`,
                inline: true,
              },
              {
                name: "New User Limit:",
                value: `${newChannel.userLimit}`,
                inline: true,
              }
            )
            .setTitle(`${config.emojis.warning} Stage Channel Updated`)
            .setDescription(
              `> **Channel Name:** <#${newChannel.id}> (||${newChannel.id}||) \n> **Updated by:** <@${executor.id}>`
            )
            .setColor("Orange")
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: newChannel.client.user.displayAvatarURL(),
            });
          logChannel.send({ embeds: [embed] });
        }
      }
    } else {
      return;
    }
  },
};
