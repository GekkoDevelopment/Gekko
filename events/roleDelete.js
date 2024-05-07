const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildRoleDelete,
  async execute(role) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_channel",
      "guild_id",
      role.guild.id
    );

    if (!logChannelId) {
      return;
    }

    const logChannel = role.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.log(`${logChannelId} not found.`);
      return;
    }

    const fetchedLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 1,
    });

    const firstEntry = fetchedLogs.entries.first();
    if (!firstEntry || !firstEntry.executor) {
      return;
    }

    const executor = firstEntry.executor;

    const embed = new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Role Deleted`)
      .setDescription(
        `> **role Name:** ${role.name} \n> **role ID:** ${role.id} \n> **Deleted by:** <@${executor.id}>`
      )
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō",
        iconURL: role.client.user.displayAvatarURL(),
      });

    logChannel.send({ embeds: [embed] });
  },
};
