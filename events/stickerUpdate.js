const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildStickerUpdate,
  async execute(oldSticker, newSticker) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_channel",
      "guild_id",
      newSticker.guild.id
    );

    if (!logChannelId) {
      return;
    }

    const logChannel = newSticker.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.log(`${logChannelId} not found.`);
      return;
    }

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
  },
};
