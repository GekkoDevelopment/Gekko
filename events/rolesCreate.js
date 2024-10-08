import { Events, EmbedBuilder, AuditLogEvent } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config.js';

export default {
  name: Events.GuildRoleCreate,
  async execute(role) {
    const logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "audit_channel",
      "guild_id",
      role.guild.id
    );

    if (logChannelId) {
      const logChannel = role.guild.channels.cache.get(logChannelId);

      const fetchedLogs = await role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleCreate,
        limit: 1,
      });

      const firstEntry = fetchedLogs.entries.first();
      if (!firstEntry || !firstEntry.executor) {
        return;
      }

      const executor = firstEntry.executor;

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Role Created`)
        .setDescription(
          `> **role Name:** ${role.name} \n> **role ID:** ${role.id} \n> **Role Mention:** <@&${role.id}> \n> **Created by:** <@${executor.id}>`
        )
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: role.client.user.displayAvatarURL(),
        });

      logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  },
};
