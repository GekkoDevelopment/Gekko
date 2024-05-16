import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config';

export default {
  name: Events.GuildEmojiDelete,
  async execute(emoji) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      emoji.guild.id
    );

    if (logChannelId) {
      const logChannel = emoji.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await emoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiDelete,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

      const executor = firstEntry.executor;

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Emoji Created`)
        .setDescription(
          `> **Emoji Name:** ${emoji.name} \n> **Emoji ID:** ${
            emoji.id
          } \n> **Animated:** ${
            emoji.animated ? "Yes" : "No"
          } \n> **Deleted by:** <@${executor.id}>`
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: emoji.client.user.displayAvatarURL(),
        });
      logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  },
};
