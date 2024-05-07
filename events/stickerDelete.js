const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildStickerDelete,
  async execute(sticker) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_channel",
      "guild_id",
      sticker.guild.id
    );

    if (!logChannelId) {
      return;
    }

    const logChannel = sticker.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.log(`${logChannelId} not found.`);
      return;
    }

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
  },
};
