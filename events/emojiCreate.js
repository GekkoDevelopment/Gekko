const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildEmojiCreate,
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
        type: AuditLogEvent.EmojiCreate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) return;

      const executor = firstEntry.executor;

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Emoji Created`)
        .setDescription(
          `> **Emoji Name:** ${emoji.name} \n> **Emoji ID:** ${
            emoji.id
          } \n> **Animated:** ${emoji.animated ? "Yes" : "No"} \n> **Emoji:** <:${
            emoji.name
          }:${emoji.id}> \n> **Created by:** <@${executor.id}>`
        )
        .setColor("Green")
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
