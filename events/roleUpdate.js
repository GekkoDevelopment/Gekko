const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.GuildRoleUpdate,
  async execute(oldRole, newRole) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      newRole.guild.id
    );

    if (logChannelId) {
      const logChannel = newRole.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await newRole.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleUpdate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;

      if (oldRole.name !== newRole.name) {
        const embed = new EmbedBuilder();
        embed
          .addFields(
            {
              name: "Previous Name:",
              value: `${oldRole.name}`,
              inline: true,
            },
            {
              name: "New Name:",
              value: `${newRole.name}`,
              inline: true,
            }
          )
          .setTitle(`${config.emojis.warning} Role Name Updated`)
          .setDescription(
            `> **role Name:** ${newRole.name} \n> **role ID:** ${newRole.id} \n> **Role Mention:** <@&${newRole.id}> \n> **Deleted by:** <@${executor.id}>`
          )
          .setColor("Orange")
          .setTimestamp()
          .setFooter({
            text: "Gekkō",
            iconURL: newRole.client.user.displayAvatarURL(),
          });
        logChannel.send({ embeds: [embed] });
      }
    } else {
      return;
    }
  },
};
