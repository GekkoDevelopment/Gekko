import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config';

export default {
  name: Events.GuildStickerUpdate,
  async execute(oldSticker, newSticker) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      newSticker.guild.id
    );

    if (logChannelId) {
      const logChannel = newSticker.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await newSticker.guild.fetchAuditLogs({
        type: AuditLogEvent.StickerUpdate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;

      if (oldSticker.name !== newSticker.name) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Name:",
              value: `${oldSticker.name}`,
              inline: true,
            },
            {
              name: "New Name:",
              value: `${newSticker.name}`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Sticker Name Updated`)
          .setDescription(
            `> **Sticker Name:** ${newSticker.name} \n> **Sticker ID:** ${
              newSticker.id
            } \n> **Description:** ${
              newSticker.description || "None"
            } \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newSticker.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }

      if (oldSticker.description !== newSticker.description) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Description:",
              value: oldSticker.description,
              inline: true,
            },
            {
              name: "New Description:",
              value: newSticker.description,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Sticker Description Updated`)
          .setDescription(
            `> **Sticker Name:** ${newSticker.name} \n> **Sticker ID:** ${
              newSticker.id
            } \n> **Description:** ${
              newSticker.description || "None"
            } \n> **Created by:** <@${executor.id}>`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newSticker.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }
    } else {
      return;
    }
  },
};
