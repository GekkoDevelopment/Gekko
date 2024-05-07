const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildScheduledEventDelete,
  async execute(event) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_channel",
      "guild_id",
      event.guild.id
    );

    if (!logChannelId) return; // I removed brackets that aren't needed, so now it's just a return.

    const logChannel = event.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.log(`${logChannelId} not found.`);
      return;
    }

    const fetchedLogs = await event.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildScheduledEventCreate,
      limit: 1,
    });

    const firstEntry = fetchedLogs.entries.first();
    if (!firstEntry || !firstEntry.executor) return; // I removed brackets that aren't needed, so now it's just a return.

    const executor = firstEntry.executor;

    const embed = new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Event Deleted`)
      .setDescription(
        `> **Event Name:** ${event.name} \n> **Where:** <#${
          event.channelId
        }> \n> **When:** <t:${Math.floor(
          event.scheduledStartTimestamp / 1000
        )}:R> \n> **Deleted by:** <@${
          executor.id
        }> \n> \n> **Event Description:** \n> ${event.description}`
      )
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō",
        iconURL: event.client.user.displayAvatarURL(),
      });

    await logChannel.send({ embeds: [embed] });
    console.log(event);
  },
};
