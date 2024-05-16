import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql'
import config from '../config';

export default {
  name: Events.GuildStickerCreate,
  async execute(sticker) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      sticker.guild.id
    );

    if (logChannelId) {
      const logChannel = sticker.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await sticker.guild.fetchAuditLogs({
        type: AuditLogEvent.StickerCreate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;
      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Sticker Created`)
        .setDescription(
          `> **Sticker Name:** ${sticker.name} \n> **Sticker ID:** ${
            sticker.id
          } \n> **Description:** ${
            sticker.description || "None"
          } \n> **Created by:** <@${executor.id}>`
        )
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: sticker.client.user.displayAvatarURL(),
        });
      logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  },
};
