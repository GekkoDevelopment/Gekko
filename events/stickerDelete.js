const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const MySQL = require("../models/mysql");
const config = require("../config");

module.exports = {
  name: Events.GuildStickerDelete,
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
        type: AuditLogEvent.StickerDelete,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;
      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Sticker Deleted`)
        .setDescription(
          `> **Sticker Name:** ${sticker.name} \n> **Sticker ID:** ${
            sticker.id
          } \n> **Description:** ${
            sticker.description || "None"
          } \n> **Deleted by:** <@${executor.id}>`
        )
        .setColor("Red")
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
